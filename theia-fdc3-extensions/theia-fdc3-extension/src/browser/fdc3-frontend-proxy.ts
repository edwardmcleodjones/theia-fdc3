import { inject, injectable, optional, postConstruct } from "@theia/core/shared/inversify";
import { WebSocketConnectionProvider } from "@theia/core/lib/browser/messaging/ws-connection-provider";
import type {
  AppIdentifier,
  AppIntent,
  Channel,
  Context,
  ContextHandler,
  ImplementationMetadata,
  IntentHandler,
  IntentResult,
  IntentResolution,
  Listener,
} from "@finos/fdc3";
import type { DisplayMetadata } from "@finos/fdc3";
import {
  FDC3_SERVICE_PATH,
  type Fdc3Client,
  type Fdc3Service,
  type IntentResolutionPlain,
  type ChannelPlain,
} from "@theia-fdc3/common/fdc3-protocol";
import type { DesktopAgent } from "@theia-fdc3/fdc3/types/desktop-agent.interface";
import type { ContextFilter } from "@theia-fdc3/fdc3/types/context.interface";
import type { IntentName } from "@theia-fdc3/fdc3/types/intent.interface";
import type { ChannelId } from "@theia-fdc3/fdc3/types/channel.interface";
import { OutputChannel, OutputChannelManager } from "@theia/output/lib/browser/output-channel";

const FDC3_EVENTS_OUTPUT_CHANNEL = "FDC3 events";

@injectable()
export class Fdc3FrontendProxy implements DesktopAgent, Fdc3Client {
  @inject(OutputChannelManager)
  @optional()
  protected readonly outputChannelManager?: OutputChannelManager;

  private readonly contextHandlers = new Map<string, ContextHandler>();
  private readonly intentHandlers = new Map<string, IntentHandler>();
  private readonly channelCache = new Map<ChannelId, Channel>();
  private readonly allowedOrigins = new Set<string>();
  private service!: Fdc3Service;
  private fdc3EventsChannel?: OutputChannel;

  constructor(
    @inject(WebSocketConnectionProvider)
    private readonly connectionProvider: WebSocketConnectionProvider,
  ) {}

  @postConstruct()
  protected async init(): Promise<void> {
    this.allowedOrigins.add(window.location.origin);
    this.service = await this.connectionProvider.createProxy<Fdc3Service>(FDC3_SERVICE_PATH, this);
    this.installWebviewBridge();
    (window as unknown as { fdc3?: DesktopAgent }).fdc3 = this;
    this.ensureEventsChannel();
  }

  async broadcast(context: Context): Promise<void> {
    this.ensureTrustedCaller();
    this.logFdc3Event("broadcast", { context });
    await this.getService().broadcast(context);
  }

  async addContextListener(handler: ContextHandler): Promise<Listener>;
  async addContextListener(filter: ContextFilter | null, handler: ContextHandler): Promise<Listener>;
  async addContextListener(
    first: ContextFilter | ContextHandler | null,
    second?: ContextHandler,
  ): Promise<Listener> {
    this.ensureTrustedCaller();
    const { filter, handler } = this.resolveContextArgs(first, second);
    const listenerId = await this.getService().registerContextListener(filter);
    this.contextHandlers.set(listenerId, handler);
    return {
      unsubscribe: async () => {
        if (this.contextHandlers.delete(listenerId)) {
          await this.getService().unregisterListener(listenerId);
        }
      },
    };
  }

  async addIntentListener(intent: IntentName, handler: IntentHandler): Promise<Listener>;
  async addIntentListener(
    intent: IntentName,
    contextType: ContextFilter | null,
    handler: IntentHandler,
  ): Promise<Listener>;
  async addIntentListener(
    intent: IntentName,
    second: ContextFilter | IntentHandler | null,
    third?: IntentHandler,
  ): Promise<Listener> {
    this.ensureTrustedCaller();
    const { filter, handler } = this.resolveIntentArgs(second, third);
    const listenerId = await this.getService().registerIntentListener(intent, filter);
    this.intentHandlers.set(listenerId, handler);
    return {
      unsubscribe: async () => {
        if (this.intentHandlers.delete(listenerId)) {
          await this.getService().unregisterListener(listenerId);
        }
      },
    };
  }

  async raiseIntent(
    intent: IntentName,
    context?: Context | null,
    target?: AppIdentifier | string,
  ): Promise<IntentResolution> {
    this.ensureTrustedCaller();
    this.logFdc3Event("raiseIntent", { intent, context, target });
    const plain = await this.getService().raiseIntent(intent, context, target);
    this.logFdc3Event("intentResolution", plain);
    return this.toIntentResolution(plain);
  }

  async findIntent(intent: IntentName, context?: Context | null): Promise<AppIntent> {
    this.ensureTrustedCaller();
    return this.getService().findIntent(intent, context ?? undefined);
  }

  async findIntentsByContext(context: Context): Promise<AppIntent[]> {
    this.ensureTrustedCaller();
    return this.getService().findIntentsByContext(context);
  }

  async getOrCreateChannel(channelId: ChannelId): Promise<Channel> {
    this.ensureTrustedCaller();
    const cached = this.channelCache.get(channelId);
    if (cached) {
      return cached;
    }
    const plain = await this.getService().getOrCreateChannel(channelId);
    const proxy = new FrontendChannelProxy(this, plain);
    this.channelCache.set(channelId, proxy);
    return proxy;
  }

  async getCurrentChannel(): Promise<Channel | null> {
    this.ensureTrustedCaller();
    const plain = await this.getService().getCurrentChannel();
    if (!plain) {
      return null;
    }
    const existing = this.channelCache.get(plain.id);
    if (existing) {
      return existing;
    }
    const proxy = new FrontendChannelProxy(this, plain);
    this.channelCache.set(plain.id, proxy);
    return proxy;
  }

  async leaveCurrentChannel(): Promise<void> {
    this.ensureTrustedCaller();
    await this.getService().leaveCurrentChannel();
  }

  async getInfo(): Promise<ImplementationMetadata> {
    this.ensureTrustedCaller();
    return this.getService().getInfo();
  }

  async getAppMetadata(app: AppIdentifier) {
    this.ensureTrustedCaller();
    return this.getService().getAppMetadata(app);
  }

  onContext(listenerId: string, context: Context): void {
    this.logFdc3Event("contextReceived", { listenerId, context });
    const handler = this.contextHandlers.get(listenerId);
    if (handler) {
      handler(context);
    }
  }

  async onIntent(listenerId: string, context: Context): Promise<IntentResult | void> {
    this.logFdc3Event("intentReceived", { listenerId, context });
    const handler = this.intentHandlers.get(listenerId);
    if (!handler) {
      return undefined;
    }
    try {
      const handlerResult = await handler(context);
      if (handlerResult !== undefined) {
        this.logFdc3Event("intentHandlerResult", { listenerId, result: handlerResult });
      }
      return handlerResult;
    } catch (error) {
      this.logFdc3Event("intentHandlerError", {
        listenerId,
        error: this.formatError(error),
      });
      console.error("[Fdc3FrontendProxy] intent handler threw", error);
      throw error;
    }
  }

  allowOrigin(origin: string): void {
    this.allowedOrigins.add(origin);
  }

  private resolveContextArgs(
    first: ContextFilter | ContextHandler | null,
    second?: ContextHandler,
  ): { filter: ContextFilter | null; handler: ContextHandler } {
    if (typeof first === "function") {
      return { filter: null, handler: first };
    }
    if (!second || typeof second !== "function") {
      throw new Error("Context handler must be provided.");
    }
    return { filter: first ?? null, handler: second };
  }

  private resolveIntentArgs(
    second: ContextFilter | IntentHandler | null,
    third?: IntentHandler,
  ): { filter: ContextFilter | null; handler: IntentHandler } {
    if (typeof second === "function") {
      return { filter: null, handler: second };
    }
    if (!third || typeof third !== "function") {
      throw new Error("Intent handler must be provided.");
    }
    return { filter: second ?? null, handler: third };
  }

  private ensureTrustedCaller(): void {
    const origin = window.location.origin;
    this.validateOrigin(origin);
  }

  private validateOrigin(origin: string): void {
    if (!this.allowedOrigins.has(origin)) {
      throw new Error(`Blocked FDC3 request from untrusted origin: ${origin}`);
    }
  }

  private toIntentResolution(plain: IntentResolutionPlain): IntentResolution {
    return {
      source: plain.source,
      intent: plain.intent,
      getResult: async () => (plain.result ?? undefined) as IntentResult,
    };
  }

  private installWebviewBridge(): void {
    window.addEventListener("message", async (event) => {
      const data = event.data;
      if (!data || typeof data !== "object" || data.namespace !== "fdc3") {
        return;
      }
      try {
        this.validateOrigin(event.origin);
      } catch (error) {
        console.warn("[Fdc3FrontendProxy] rejected message from origin", event.origin);
        return;
      }

      const { requestId, action, payload } = data;
      const source = event.source as Window | null;
      const respond = (response: unknown) => {
        source?.postMessage(
          {
            namespace: "fdc3-host",
            requestId,
            response,
          },
          event.origin,
        );
      };

      try {
        switch (action) {
          case "broadcast":
            await this.broadcast(payload.context);
            respond({ ok: true });
            break;
          case "raiseIntent":
            respond(await this.raiseIntent(payload.intent, payload.context, payload.target));
            break;
          default:
            respond({ error: `Unsupported action ${action}` });
        }
      } catch (error) {
        respond({ error: error instanceof Error ? error.message : String(error) });
      }
    });
  }

  private getService(): Fdc3Service {
    if (!this.service) {
      throw new Error("FDC3 service is not initialised yet.");
    }
    return this.service;
  }

  private ensureEventsChannel(): OutputChannel | undefined {
    if (!this.outputChannelManager) {
      return undefined;
    }
    if (!this.fdc3EventsChannel) {
      this.fdc3EventsChannel = this.outputChannelManager.getChannel(FDC3_EVENTS_OUTPUT_CHANNEL);
    }
    return this.fdc3EventsChannel;
  }

  private logFdc3Event(event: string, payload?: unknown): void {
    const channel = this.ensureEventsChannel();
    if (!channel) {
      return;
    }
    const timestamp = new Date().toISOString();
    const suffix = payload === undefined ? "" : ` ${this.formatPayload(payload)}`;
    channel.appendLine(`[${timestamp}] ${event}${suffix}`);
  }

  private formatPayload(payload: unknown): string {
    if (payload === null) {
      return "null";
    }
    if (typeof payload === "string") {
      return payload;
    }
    try {
      return JSON.stringify(payload);
    } catch (error) {
      return JSON.stringify({
        error: "unserializable payload",
        detail: this.formatError(error),
      });
    }
  }

  private formatError(error: unknown): string {
    if (error instanceof Error) {
      return `${error.name}: ${error.message}`;
    }
    return String(error);
  }
}

class FrontendChannelProxy implements Channel {
  constructor(
    private readonly agent: Fdc3FrontendProxy,
    private readonly plain: ChannelPlain,
  ) {}

  get id(): string {
    return this.plain.id;
  }

  get type(): Channel["type"] {
    return (this.plain.type as Channel["type"]) ?? "user";
  }

  get displayMetadata(): DisplayMetadata | undefined {
    return this.plain.displayMetadata as DisplayMetadata | undefined;
  }

  async broadcast(context: Context): Promise<void> {
    await this.agent.broadcast(context);
  }

  async getCurrentContext(): Promise<Context | null> {
    const channel = await this.agent.getCurrentChannel();
    if (!channel) {
      return null;
    }
    // Until dedicated channel APIs are implemented, rely on workspace last context.
    return null;
  }

  async addContextListener(handler: ContextHandler): Promise<Listener>;
  async addContextListener(contextType: string | null, handler: ContextHandler): Promise<Listener>;
  async addContextListener(
    first: string | ContextHandler | null,
    second?: ContextHandler,
  ): Promise<Listener> {
    if (typeof first === "function") {
      return this.agent.addContextListener(first);
    }
    return this.agent.addContextListener(first ?? null, second!);
  }
}

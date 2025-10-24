import { inject, injectable } from "@theia/core/shared/inversify";
import type {
  AppIdentifier,
  AppIntent,
  AppMetadata,
  Channel,
  Context,
  ImplementationMetadata,
  IntentResult,
  Listener,
} from "@finos/fdc3";
import { FDC3_SYMBOLS } from "@theia-fdc3/fdc3/fdc3-di-module";
import type { ContextFilter } from "@theia-fdc3/fdc3/types/context.interface";
import type { IntentName } from "@theia-fdc3/fdc3/types/intent.interface";
import type { ChannelId } from "@theia-fdc3/fdc3/types/channel.interface";
import type { Fdc3Client, Fdc3Service, IntentResolutionPlain, ChannelPlain } from "@theia-fdc3/common/fdc3-protocol";
import { DesktopAgentImpl } from "@theia-fdc3/fdc3/services/desktop-agent.service";

@injectable()
export class Fdc3ServiceImpl implements Fdc3Service {
  private client: Fdc3Client | undefined;
  private readonly contextListeners = new Map<string, Listener>();
  private readonly intentListeners = new Map<string, Listener>();
  private listenerCounter = 0;

  constructor(
    @inject(FDC3_SYMBOLS.DesktopAgent)
    private readonly desktopAgent: DesktopAgentImpl,
  ) {}

  dispose(): void {
    for (const listener of this.contextListeners.values()) {
      listener.unsubscribe().catch(() => undefined);
    }
    for (const listener of this.intentListeners.values()) {
      listener.unsubscribe().catch(() => undefined);
    }
    this.contextListeners.clear();
    this.intentListeners.clear();
  }

  setClient(client: Fdc3Client | undefined): void {
    this.client = client;
  }

  async broadcast(context: Context): Promise<void> {
    await this.desktopAgent.broadcast(context);
  }

  async registerContextListener(filter: ContextFilter | null): Promise<string> {
    const listenerId = this.nextListenerId("ctx");
    const listener = await this.desktopAgent.addContextListener(filter ?? null, (context) => {
      this.client?.onContext(listenerId, context);
    });
    this.contextListeners.set(listenerId, listener);
    return listenerId;
  }

  async registerIntentListener(intent: IntentName, contextType: ContextFilter | null): Promise<string> {
    const listenerId = this.nextListenerId("intent");
    const listener = await this.desktopAgent.addIntentListener(
      intent,
      contextType ?? null,
      async (context) => {
        if (!this.client) {
          return undefined;
        }
        return this.client.onIntent(listenerId, context);
      },
    );
    this.intentListeners.set(listenerId, listener);
    return listenerId;
  }

  async unregisterListener(listenerId: string): Promise<void> {
    const contextListener = this.contextListeners.get(listenerId);
    if (contextListener) {
      this.contextListeners.delete(listenerId);
      await contextListener.unsubscribe();
      return;
    }

    const intentListener = this.intentListeners.get(listenerId);
    if (intentListener) {
      this.intentListeners.delete(listenerId);
      await intentListener.unsubscribe();
    }
  }

  async raiseIntent(
    intent: IntentName,
    context?: Context | null,
    target?: AppIdentifier | string,
  ): Promise<IntentResolutionPlain> {
    const resolution = await this.desktopAgent.raiseIntent(intent, context, target);
    let result: IntentResult | undefined;
    try {
      result = await resolution.getResult();
    } catch {
      result = undefined;
    }

    return {
      source: resolution.source,
      intent: resolution.intent,
      result,
    };
  }

  async findIntent(intent: IntentName, context?: Context | null): Promise<AppIntent> {
    return this.desktopAgent.findIntent(intent, context ?? undefined);
  }

  async findIntentsByContext(context: Context): Promise<AppIntent[]> {
    return this.desktopAgent.findIntentsByContext(context);
  }

  async getOrCreateChannel(channelId: ChannelId): Promise<ChannelPlain> {
    const channel = await this.desktopAgent.getOrCreateChannel(channelId);
    return this.toChannelPlain(channel);
  }

  async getCurrentChannel(): Promise<ChannelPlain | null> {
    const channel = await this.desktopAgent.getCurrentChannel();
    return channel ? this.toChannelPlain(channel) : null;
  }

  async leaveCurrentChannel(): Promise<void> {
    await this.desktopAgent.leaveCurrentChannel();
  }

  async getInfo(): Promise<ImplementationMetadata> {
    return this.desktopAgent.getInfo();
  }

  async getAppMetadata(app: AppIdentifier): Promise<AppMetadata> {
    return this.desktopAgent.getAppMetadata(app);
  }

  private toChannelPlain(channel: Channel): ChannelPlain {
    return {
      id: channel.id,
      type: channel.type,
      displayMetadata: channel.displayMetadata,
    };
  }

  private nextListenerId(prefix: string): string {
    this.listenerCounter += 1;
    return `${prefix}:${this.listenerCounter}`;
  }
}

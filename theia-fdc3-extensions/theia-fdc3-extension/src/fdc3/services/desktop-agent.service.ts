import { inject, injectable } from "@theia/core/shared/inversify";
import type {
  AppIdentifier,
  AppIntent,
  AppMetadata,
  Channel,
  Context,
  ContextHandler,
  DisplayMetadata,
  ImplementationMetadata,
  Intent,
  IntentHandler,
  IntentResolution,
  IntentResult,
  Listener,
} from "@finos/fdc3";
import { FDC3_SYMBOLS } from "@theia-fdc3/fdc3/fdc3-di-module";
import type { ChannelModel } from "@theia-fdc3/fdc3/models/channel.model";
import type { WorkspaceModel } from "@theia-fdc3/fdc3/models/workspace.model";
import type { DesktopAgent } from "@theia-fdc3/fdc3/types/desktop-agent.interface";
import type { ContextFilter } from "@theia-fdc3/fdc3/types/context.interface";
import type { IntentListenerDescriptor, IntentName } from "@theia-fdc3/fdc3/types/intent.interface";
import type { ChannelId, WorkspaceId } from "@theia-fdc3/fdc3/types/channel.interface";
import { WorkspaceChannelMapperService } from "@theia-fdc3/fdc3/services/workspace-channel-mapper.service";
import { WorkspaceContextBusService } from "@theia-fdc3/fdc3/services/workspace-context-bus.service";
import { ContextValidatorService } from "@theia-fdc3/fdc3/services/context-validator.service";
import type { WorkspaceResolver } from "@theia-fdc3/fdc3/services/workspace-resolver.service";
import { IntentRegistryService } from "@theia-fdc3/fdc3/services/intent-registry.service";
import { Fdc3LoggerService } from "@theia-fdc3/fdc3/services/fdc3-logger.service";

interface ListenerBinding {
  readonly id: string;
  readonly listener: Listener;
}

@injectable()
export class DesktopAgentImpl implements DesktopAgent {
  private readonly listenerBindings = new Map<string, ListenerBinding>();
  private readonly channelProxies = new Map<ChannelId, Channel>();

  constructor(
    @inject(FDC3_SYMBOLS.WorkspaceContextBus)
    private readonly contextBus: WorkspaceContextBusService,
    @inject(FDC3_SYMBOLS.WorkspaceChannelMapper)
    private readonly channelMapper: WorkspaceChannelMapperService,
    @inject(FDC3_SYMBOLS.ContextValidator)
    private readonly contextValidator: ContextValidatorService,
    @inject(FDC3_SYMBOLS.IntentRegistry)
    private readonly intentRegistry: IntentRegistryService,
    @inject(FDC3_SYMBOLS.Logger)
    private readonly logger: Fdc3LoggerService,
    @inject(FDC3_SYMBOLS.WorkspaceResolver)
    private readonly workspaceResolver: WorkspaceResolver,
  ) {}

  async broadcast(context: Context): Promise<void> {
    this.contextValidator.validate(context);

    const workspaceId = this.resolveWorkspaceId();
    const channel = this.ensureWorkspaceChannelModel(workspaceId);

    try {
      this.contextBus.broadcast({
        workspaceId,
        channelId: channel.id,
        context,
        timestamp: Date.now(),
      });
      this.channelMapper.updateLastContext(workspaceId, context);
      this.logger.info("FDC3 broadcast delivered", {
        workspaceId,
        channelId: channel.id,
        context: this.logger.summarizeContext(context),
      });
    } catch (error) {
      this.logger.error("FDC3 broadcast failed", {
        workspaceId,
        channelId: channel.id,
        context: this.logger.summarizeContext(context),
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async addContextListener(handler: ContextHandler): Promise<Listener>;
  async addContextListener(filter: ContextFilter | null, handler: ContextHandler): Promise<Listener>;
  async addContextListener(
    first: ContextFilter | ContextHandler | null,
    second?: ContextHandler,
  ): Promise<Listener> {
    const { filter, handler } = this.resolveListenerArguments(first, second);

    const workspaceId = this.resolveWorkspaceId();
    const channel = this.ensureWorkspaceChannelModel(workspaceId);
    const descriptor = this.contextBus.registerListener(workspaceId, channel.id, handler, filter);

    let active = true;
    const listener: Listener = {
      unsubscribe: async () => {
        if (!active) {
          return;
        }
        active = false;
        this.contextBus.removeListener(descriptor.id);
        this.listenerBindings.delete(descriptor.id);
        this.logger.debug("FDC3 context listener removed", {
          workspaceId,
          channelId: channel.id,
          listenerId: descriptor.id,
        });
      },
    };

    this.listenerBindings.set(descriptor.id, { id: descriptor.id, listener });
    this.logger.debug("FDC3 context listener registered", {
      workspaceId,
      channelId: channel.id,
      listenerId: descriptor.id,
      filter,
    });
    return listener;
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
    const { filter, handler } = this.resolveIntentListenerArguments(second, third);
    const workspaceId = this.resolveWorkspaceId();
    const descriptor = this.intentRegistry.registerListener(workspaceId, intent, handler, filter ?? null);

    let active = true;
    const listener: Listener = {
      unsubscribe: async () => {
        if (!active) {
          return;
        }
        active = false;
        this.intentRegistry.removeListener(descriptor.id);
        this.listenerBindings.delete(descriptor.id);
        this.logger.debug("FDC3 intent listener removed", {
          workspaceId,
          intent,
          listenerId: descriptor.id,
        });
      },
    };

    this.listenerBindings.set(descriptor.id, { id: descriptor.id, listener });
    this.logger.debug("FDC3 intent listener registered", {
      workspaceId,
      intent,
      listenerId: descriptor.id,
      filter,
    });
    return listener;
  }

  async raiseIntent(
    intent: IntentName,
    context?: Context | null,
    target?: AppIdentifier | string,
  ): Promise<IntentResolution> {
    if (context) {
      this.contextValidator.validate(context);
    }

    const workspaceId = this.resolveWorkspaceId();
    const listeners = this.intentRegistry.getListeners(workspaceId, intent);
    const eligible = context
      ? listeners.filter((descriptor) => this.contextValidator.matchesFilter(context, descriptor.contextFilter))
      : listeners;

    const chosen = this.selectIntentHandler(eligible, target, intent);
    if (!chosen) {
      throw new Error(`No handler found for intent ${intent}`);
    }

    const resultPromise = Promise.resolve(
      chosen.handler(context ?? ({} as Context)),
    ) as Promise<IntentResult>;
    const source = this.toAppIdentifier(chosen);

    this.logger.info("FDC3 intent routed", {
      workspaceId,
      intent,
      target,
      handler: source,
      context: this.logger.summarizeContext(context ?? undefined),
    });

    return {
      source,
      intent: intent as Intent,
      getResult: () => resultPromise,
    };
  }

  async findIntent(intent: IntentName, context?: Context | null): Promise<AppIntent> {
    if (context) {
      this.contextValidator.validate(context);
    }
    const workspaceId = this.resolveWorkspaceId();
    const listeners = this.intentRegistry.getListeners(workspaceId, intent);
    if (listeners.length === 0) {
      const message = `No handlers registered for intent ${intent}`;
      this.logger.warn(message, { workspaceId });
      throw new Error(message);
    }

    const filtered = context
      ? listeners.filter((descriptor) => this.contextValidator.matchesFilter(context, descriptor.contextFilter))
      : listeners;

    if (filtered.length === 0) {
      const message = `No handlers accept provided context for intent ${intent}`;
      this.logger.warn(message, {
        workspaceId,
        context: this.logger.summarizeContext(context ?? undefined),
      });
      throw new Error(message);
    }

    return {
      intent: { name: intent },
      apps: filtered.map((descriptor) => this.toAppMetadata(descriptor)),
    };
  }

  async findIntentsByContext(context: Context): Promise<AppIntent[]> {
    this.contextValidator.validate(context);
    const workspaceId = this.resolveWorkspaceId();
    const entries = this.intentRegistry.getIntentsForWorkspace(workspaceId);

    const intents: AppIntent[] = [];
    for (const [intentName, descriptors] of entries) {
      const matching = descriptors.filter((descriptor) =>
        this.contextValidator.matchesFilter(context, descriptor.contextFilter),
      );
      if (matching.length > 0) {
        intents.push({
          intent: { name: intentName },
          apps: matching.map((descriptor) => this.toAppMetadata(descriptor)),
        });
      }
    }

    return intents;
  }

  async getOrCreateChannel(channelId: ChannelId): Promise<Channel> {
    const workspaceId = this.resolveWorkspaceId();
    const model = this.ensureWorkspaceChannelModel(workspaceId, channelId);
    let proxy = this.channelProxies.get(model.id);
    if (!proxy) {
      proxy = new WorkspaceChannelProxy(this, workspaceId, model);
      this.channelProxies.set(model.id, proxy);
    }
    this.logger.debug("Resolved channel", { workspaceId, channelId: model.id });
    return proxy;
  }

  async getCurrentChannel(): Promise<Channel | null> {
    const workspaceId = this.resolveWorkspaceId();
    const model = this.ensureWorkspaceChannelModel(workspaceId);
    return this.getOrCreateChannel(model.id);
  }

  async leaveCurrentChannel(): Promise<void> {
    // Workspace-scoped channels are tied to the workspace lifecycle; leaving is a no-op.
  }

  async getInfo(): Promise<ImplementationMetadata> {
    return {
      fdc3Version: "2.2.0",
      provider: "theia-fdc3",
      providerVersion: "0.1.0",
      optionalFeatures: {
        OriginatingAppMetadata: false,
        UserChannelMembershipAPIs: false,
        DesktopAgentBridging: false,
      },
      appMetadata: {
        appId: "theia.desktop-agent",
        name: "Theia Desktop Agent",
        title: "Theia Desktop Agent",
      },
    };
  }

  async getAppMetadata(app: AppIdentifier): Promise<AppMetadata> {
    return {
      appId: app.appId,
      instanceId: app.instanceId,
      name: app.appId,
      title: app.appId,
    };
  }

  private resolveWorkspaceId(): WorkspaceId {
    return this.workspaceResolver.getActiveWorkspaceId();
  }

  private ensureWorkspaceChannelModel(
    workspaceId: WorkspaceId,
    requestedChannelId?: ChannelId,
  ): ChannelModel {
    let channel = this.channelMapper.getChannelForWorkspace(workspaceId);
    if (channel) {
      return channel;
    }

    channel = this.channelMapper.registerWorkspace(
      this.createWorkspaceSkeleton(workspaceId, requestedChannelId),
    );
    this.logger.debug("Registered workspace channel", { workspaceId, channelId: channel.id });
    return channel;
  }

  private resolveListenerArguments(
    first: ContextFilter | ContextHandler | null,
    second?: ContextHandler,
  ): { filter: ContextFilter | null; handler: ContextHandler } {
    if (typeof first === "function") {
      // Only handler provided.
      return { filter: null, handler: first };
    }

    if (!second || typeof second !== "function") {
      throw new Error("Context handler must be provided.");
    }

    const filter = first ?? null;
    return { filter, handler: second };
  }

  private resolveIntentListenerArguments(
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

  private selectIntentHandler(
    listeners: IntentListenerDescriptor[],
    target: AppIdentifier | string | undefined,
    intent: IntentName,
  ): IntentListenerDescriptor | undefined {
    if (target) {
      const handler = listeners.find((descriptor) => this.matchesTarget(descriptor, target));
      if (!handler) {
        const message = `No handler for intent ${intent} matched the specified target`;
        this.logger.warn(message, { intent, target, workspaceId: listeners[0]?.workspaceId });
        throw new Error(message);
      }
      return handler;
    }

    if (listeners.length === 0) {
      return undefined;
    }

    if (listeners.length === 1) {
      return listeners[0];
    }

    const message = "Multiple handlers available. Resolver UI not implemented yet.";
    this.logger.warn(message, { intent, handlerCount: listeners.length });
    throw new Error(message);
  }

  private matchesTarget(descriptor: IntentListenerDescriptor, target: AppIdentifier | string): boolean {
    const identifier = this.toAppIdentifier(descriptor);
    if (typeof target === "string") {
      return identifier.appId === target;
    }

    if (target.appId && identifier.appId !== target.appId) {
      return false;
    }

    if (target.instanceId && identifier.instanceId !== target.instanceId) {
      return false;
    }

    return true;
  }

  private toAppIdentifier(descriptor: IntentListenerDescriptor): AppIdentifier {
    const source = descriptor.source;
    if (source) {
      return source;
    }

    return {
      appId: `workspace:${descriptor.workspaceId}`,
      instanceId: descriptor.id,
    };
  }

  private toAppMetadata(descriptor: IntentListenerDescriptor): AppMetadata {
    const identifier = this.toAppIdentifier(descriptor);
    return {
      ...identifier,
      name: identifier.appId,
      title: descriptor.intent,
    };
  }

  getChannelContextSnapshot(
    workspaceId: WorkspaceId,
    channelId: ChannelId,
    contextType?: string,
  ): Context | null {
    const envelope = this.contextBus.getLastContext(workspaceId, channelId);
    if (!envelope) {
      return null;
    }

    if (contextType && envelope.context.type !== contextType) {
      return null;
    }

    return envelope.context;
  }

  private createWorkspaceSkeleton(workspaceId: WorkspaceId, channelId?: ChannelId): WorkspaceModel {
    const resolvedChannelId: ChannelId = channelId ?? workspaceId;
    const workspace: WorkspaceModel = {
      id: workspaceId,
      name: `Workspace ${workspaceId}`,
      channelId: resolvedChannelId,
      openApps: [],
    };
    return workspace;
  }
}

class WorkspaceChannelProxy implements Channel {
  constructor(
    private readonly agent: DesktopAgentImpl,
    private readonly workspaceId: WorkspaceId,
    private readonly model: ChannelModel,
  ) {}

  get id(): string {
    return this.model.id;
  }

  get type(): Channel["type"] {
    return (this.model.type as Channel["type"]) ?? "app";
  }

  get displayMetadata(): DisplayMetadata | undefined {
    if (!this.model.name && !this.model.color) {
      return undefined;
    }
    return {
      name: this.model.name,
      color: this.model.color,
    };
  }

  async broadcast(context: Context): Promise<void> {
    await this.agent.broadcast(context);
  }

  async getCurrentContext(contextType?: string): Promise<Context | null> {
    return this.agent.getChannelContextSnapshot(this.workspaceId, this.model.id, contextType);
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

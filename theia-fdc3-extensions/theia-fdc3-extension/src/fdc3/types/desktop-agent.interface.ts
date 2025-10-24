import type {
  AppIdentifier,
  AppIntent,
  AppMetadata,
  Channel,
  Context,
  ContextHandler,
  ImplementationMetadata,
  IntentHandler,
  IntentResolution,
  Listener,
} from "@finos/fdc3";
import type { ChannelId } from "./channel.interface";
import type { ContextFilter } from "./context.interface";
import type { IntentName } from "./intent.interface";

/**
 * Lightweight handler descriptor that keeps track of the original handler
 * alongside the optional context filter used during registration.
 */
export interface ContextListenerRegistration {
  /**
   * Unique identifier assigned by the Desktop Agent implementation.
   */
  readonly id: string;
  /**
   * Workspace-scoped channel identifier the listener is associated with.
   */
  readonly channelId: ChannelId | null;
  /**
   * Optional filter narrowing the listener to a specific context type.
   */
  readonly filter: ContextFilter | null;
  /**
   * Handler provided by the caller.
   */
  readonly handler: ContextHandler;
}

/**
 * Mirrors the public shape of the FDC3 DesktopAgent while keeping the surface
 * intentionally focused on the features required for the MVP (broadcast/listen
 * and intents). Additional methods from the FINOS standard can be added over
 * time without breaking consumers.
 */
export interface DesktopAgent {
  /**
   * Broadcast a context to other members of the current workspace channel.
   */
  broadcast(context: Context): Promise<void>;

  /**
   * Subscribe to context updates within the current workspace channel. When no
   * filter is provided the listener receives every broadcast.
   */
  addContextListener(handler: ContextHandler): Promise<Listener>;
  addContextListener(filter: ContextFilter | null, handler: ContextHandler): Promise<Listener>;

  /**
   * Register a handler for an intent. Optional context type filtering follows
   * the FINOS FDC3 semantics.
   */
  addIntentListener(intent: IntentName, handler: IntentHandler): Promise<Listener>;
  addIntentListener(intent: IntentName, contextType: ContextFilter | null, handler: IntentHandler): Promise<Listener>;

  /**
   * Raise an intent for the current workspace context.
   */
  raiseIntent(
    intent: IntentName,
    context?: Context | null,
    target?: AppIdentifier | string,
  ): Promise<IntentResolution>;

  /**
   * Resolver helpers to surface metadata about available handlers.
   */
  findIntent(intent: IntentName, context?: Context | null): Promise<AppIntent>;
  findIntentsByContext(context: Context): Promise<AppIntent[]>;

  /**
   * Channel management helpers. `getOrCreateChannel` ensures a workspace scoped
   * channel exists and returns it to the caller.
   */
  getOrCreateChannel(channelId: ChannelId): Promise<Channel>;
  getCurrentChannel(): Promise<Channel | null>;
  leaveCurrentChannel(): Promise<void>;

  /**
   * Provide runtime metadata about the Desktop Agent implementation.
   */
  getInfo(): Promise<ImplementationMetadata>;
  /**
   * Retrieve metadata about an application or app instance known to the Desktop Agent.
   */
  getAppMetadata(app: AppIdentifier): Promise<AppMetadata>;
}

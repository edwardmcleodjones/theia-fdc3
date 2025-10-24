import type { Context, ContextHandler } from "@finos/fdc3";
import type { AppInstanceId, ChannelId, WorkspaceId } from "./channel.interface";

/**
 * Optional filter applied to context listeners. When `null` or `"*"` listeners will
 * receive every context broadcast; otherwise only the matching type is routed.
 */
export type ContextFilter = string | null;

/**
 * Identifier assigned to context listeners registered through the Desktop
 * Agent. These map back to FDC3 Listener objects in the runtime.
 */
export type ContextListenerId = string;

/**
 * Context payload augmented with workspace metadata and bookkeeping metadata so
 * that the routing layer can enforce isolation without persisting full payload
 * details.
 */
export interface WorkspaceContextEnvelope {
  readonly workspaceId: WorkspaceId;
  readonly channelId: ChannelId;
  readonly context: Context;
  /**
    * Timestamp expressed in epoch milliseconds when the context entered the bus.
    */
  readonly timestamp: number;
  /**
   * Optional identifier for the originator (app instance, widget id, etc).
   */
  readonly origin?: AppInstanceId;
}

/**
 * Internal descriptor for registered listeners. Stored in the context bus and
 * resolved when FDC3 `Listener.unsubscribe()` is invoked.
 */
export interface ContextListenerDescriptor {
  readonly id: ContextListenerId;
  readonly workspaceId: WorkspaceId;
  readonly channelId: ChannelId | null;
  readonly filter: ContextFilter;
  readonly handler: ContextHandler;
}

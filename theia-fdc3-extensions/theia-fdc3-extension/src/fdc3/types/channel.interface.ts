import type { Channel } from "@finos/fdc3";
import type { WorkspaceContextEnvelope } from "./context.interface";

/** Unique identifier assigned to a workspace instance. */
export type WorkspaceId = string;
/** Identifier for an FDC3 channel. */
export type ChannelId = string;
/** Identifier for an app instance participating in interop. */
export type AppInstanceId = string;

/**
 * Minimum projection of a channel used by the Desktop Agent while keeping
 * workspace-scoped metadata available for routing decisions.
 */
export interface WorkspaceChannelSnapshot {
  readonly workspaceId: WorkspaceId;
  readonly channelId: ChannelId;
  readonly members: ReadonlySet<AppInstanceId>;
  readonly lastContext?: WorkspaceContextEnvelope;
}

export interface ChannelMember {
  readonly instanceId: AppInstanceId;
  readonly appId?: string;
  readonly joinedAt: number;
}

/**
 * Mutable representation of a channel state while the platform is running.
 */
export interface WorkspaceChannelState {
  readonly workspaceId: WorkspaceId;
  readonly channelId: ChannelId;
  readonly channel?: Channel;
  readonly members: Map<AppInstanceId, ChannelMember>;
  lastContext?: WorkspaceContextEnvelope;
}

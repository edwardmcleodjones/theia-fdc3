import type { Context } from "@finos/fdc3";
import type { AppInstanceId, ChannelId, WorkspaceId } from "@theia-fdc3/fdc3/types/channel.interface";

export interface WorkspaceModel {
  readonly id: WorkspaceId;
  readonly name: string;
  readonly channelId: ChannelId;
  readonly layoutState?: unknown;
  readonly openApps: AppInstanceModel[];
}

export interface AppInstanceModel {
  readonly instanceId: AppInstanceId;
  readonly appId: string;
  readonly workspaceId: WorkspaceId;
  readonly joinedChannelId: ChannelId;
  readonly state?: unknown;
}

export interface WorkspaceSnapshot {
  readonly workspace: WorkspaceModel;
  readonly lastContext?: Context;
}


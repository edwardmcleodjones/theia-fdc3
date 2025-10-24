import type { Context } from "@finos/fdc3";
import type {
  AppInstanceId,
  ChannelId,
  ChannelMember,
  WorkspaceId,
} from "@theia-fdc3/fdc3/types/channel.interface";

export interface ChannelModel {
  readonly id: ChannelId;
  readonly workspaceId: WorkspaceId;
  readonly name: string;
  readonly type?: string;
  readonly color?: string;
  readonly members: ReadonlyArray<AppInstanceId>;
  readonly lastContext?: Context;
}

export interface ChannelUpdate {
  readonly members?: ChannelMember[];
  readonly lastContext?: Context;
}


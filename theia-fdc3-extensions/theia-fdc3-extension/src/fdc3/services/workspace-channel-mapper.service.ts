import { injectable } from "@theia/core/shared/inversify";
import type { Context } from "@finos/fdc3";
import type { ChannelModel } from "@theia-fdc3/fdc3/models/channel.model";
import type { WorkspaceModel } from "@theia-fdc3/fdc3/models/workspace.model";
import type { ChannelId, WorkspaceId, ChannelMember } from "@theia-fdc3/fdc3/types/channel.interface";

@injectable()
export class WorkspaceChannelMapperService {
  private readonly workspaceChannels = new Map<WorkspaceId, ChannelModel>();
  private readonly channelWorkspaces = new Map<ChannelId, WorkspaceModel>();

  registerWorkspace(workspace: WorkspaceModel): ChannelModel {
    const existingWorkspace = this.channelWorkspaces.get(workspace.channelId);
    if (existingWorkspace && existingWorkspace.id !== workspace.id) {
      throw new Error(
        `Channel ${workspace.channelId} already associated with workspace ${existingWorkspace.id}`,
      );
    }

    this.channelWorkspaces.set(workspace.channelId, workspace);
    const channel: ChannelModel = {
      id: workspace.channelId,
      workspaceId: workspace.id,
      name: `${workspace.name} Channel`,
      type: "workspace",
      members: workspace.openApps.map((app) => app.instanceId),
    };
    this.workspaceChannels.set(workspace.id, channel);
    return channel;
  }

  getChannelForWorkspace(workspaceId: WorkspaceId): ChannelModel | undefined {
    return this.workspaceChannels.get(workspaceId);
  }

  getWorkspaceForChannel(channelId: ChannelId): WorkspaceModel | undefined {
    return this.channelWorkspaces.get(channelId);
  }

  updateChannelMembers(workspaceId: WorkspaceId, members: ChannelMember[]): void {
    const channel = this.workspaceChannels.get(workspaceId);
    if (!channel) {
      return;
    }
    this.workspaceChannels.set(workspaceId, {
      ...channel,
      members: members.map((member) => member.instanceId),
    });
  }

  updateLastContext(workspaceId: WorkspaceId, context: Context | undefined): void {
    const channel = this.workspaceChannels.get(workspaceId);
    if (!channel) {
      return;
    }
    this.workspaceChannels.set(workspaceId, {
      ...channel,
      lastContext: context,
    });
  }

  removeWorkspace(workspaceId: WorkspaceId): void {
    const channel = this.workspaceChannels.get(workspaceId);
    if (channel) {
      this.channelWorkspaces.delete(channel.id);
    }
    this.workspaceChannels.delete(workspaceId);
  }
}


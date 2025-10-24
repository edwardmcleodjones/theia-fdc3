import { injectable } from "@theia/core/shared/inversify";
import type { ContextHandler } from "@finos/fdc3";
import {
  type AppInstanceId,
  type ChannelId,
  type WorkspaceChannelState,
  type WorkspaceId,
  type ChannelMember,
} from "@theia-fdc3/fdc3/types/channel.interface";
import {
  type ContextFilter,
  type ContextListenerDescriptor,
  type ContextListenerId,
  type WorkspaceContextEnvelope,
} from "@theia-fdc3/fdc3/types/context.interface";

interface WorkspaceState {
  readonly workspaceId: WorkspaceId;
  readonly channels: Map<ChannelId, ChannelState>;
  readonly workspaceListeners: Map<ContextListenerId, ContextListenerDescriptor>;
}

interface ChannelState extends WorkspaceChannelState {
  readonly listeners: Map<ContextListenerId, ContextListenerDescriptor>;
}

interface ListenerLocation {
  readonly workspace: WorkspaceState;
  readonly channel?: ChannelState;
}

@injectable()
export class WorkspaceContextBusService {
  private readonly workspaces = new Map<WorkspaceId, WorkspaceState>();
  private readonly listenerIndex = new Map<ContextListenerId, ListenerLocation>();
  private listenerCounter = 0;
  private readonly channelOwnership = new Map<ChannelId, WorkspaceId>();

  /**
   * Registers a listener for the given workspace/channel pair.
   */
  registerListener(
    workspaceId: WorkspaceId,
    channelId: ChannelId | null,
    handler: ContextHandler,
    filter: ContextFilter = null,
  ): ContextListenerDescriptor {
    const workspace = this.ensureWorkspace(workspaceId);
    const descriptor: ContextListenerDescriptor = {
      id: this.nextListenerId(workspaceId),
      workspaceId,
      channelId,
      filter,
      handler,
    };

    if (channelId) {
      this.assertChannelOwnership(workspace.workspaceId, channelId);
      const channel = this.ensureChannel(workspace, channelId);
      channel.listeners.set(descriptor.id, descriptor);
      this.listenerIndex.set(descriptor.id, { workspace, channel });
    } else {
      workspace.workspaceListeners.set(descriptor.id, descriptor);
      this.listenerIndex.set(descriptor.id, { workspace });
    }

    return descriptor;
  }

  /**
   * Removes a previously registered listener. Returns true when the listener
   * existed and has been removed.
   */
  removeListener(listenerId: ContextListenerId): boolean {
    const location = this.listenerIndex.get(listenerId);
    if (!location) {
      return false;
    }

    if (location.channel) {
      location.channel.listeners.delete(listenerId);
    } else {
      location.workspace.workspaceListeners.delete(listenerId);
    }

    this.listenerIndex.delete(listenerId);
    return true;
  }

  /**
   * Broadcasts a context to every listener bound to the given workspace and
   * channel. Workspace-scoped listeners (channelId === null) also receive the
   * payload.
   */
  broadcast(envelope: WorkspaceContextEnvelope): void {
    const workspace = this.workspaces.get(envelope.workspaceId);
    if (!workspace) {
      return;
    }

    this.assertChannelOwnership(workspace.workspaceId, envelope.channelId);
    const channel = this.ensureChannel(workspace, envelope.channelId);
    if (envelope.origin && !channel.members.has(envelope.origin)) {
      console.warn(
        "[WorkspaceContextBusService] rejecting broadcast from non-member",
        envelope.origin,
        "workspace:",
        envelope.workspaceId,
        "channel:",
        envelope.channelId,
      );
      return;
    }
    channel.lastContext = envelope;

    this.emit(channel.listeners.values(), envelope);
    this.emit(workspace.workspaceListeners.values(), envelope);
  }

  /**
   * Returns the last context broadcast in the workspace/channel, if any.
   */
  getLastContext(workspaceId: WorkspaceId, channelId: ChannelId): WorkspaceContextEnvelope | undefined {
    const workspace = this.workspaces.get(workspaceId);
    if (!workspace) {
      return undefined;
    }

    return workspace.channels.get(channelId)?.lastContext;
  }

  /**
   * Adds an app instance to the channel membership tracking for the workspace.
   */
  addMember(
    workspaceId: WorkspaceId,
    channelId: ChannelId,
    member: ChannelMember,
  ): void {
    const workspace = this.ensureWorkspace(workspaceId);
    this.assertChannelOwnership(workspaceId, channelId);
    const channel = this.ensureChannel(workspace, channelId);
    channel.members.set(member.instanceId, member);
  }

  /**
   * Removes an app instance from the channel membership tracking.
   */
  removeMember(workspaceId: WorkspaceId, channelId: ChannelId, memberId: AppInstanceId): void {
    const workspace = this.workspaces.get(workspaceId);
    if (!workspace) {
      return;
    }

    const channel = workspace.channels.get(channelId);
    channel?.members.delete(memberId);
  }

  /**
   * Retrieves the current set of members for a workspace channel.
   */
  getMembers(workspaceId: WorkspaceId, channelId: ChannelId): ChannelMember[] {
    const workspace = this.workspaces.get(workspaceId);
    if (!workspace) {
      return [];
    }

    const channel = workspace.channels.get(channelId);
    if (!channel) {
      return [];
    }

    return Array.from(channel.members.values());
  }

  /**
   * Clears all state related to a workspace.
   */
  clearWorkspace(workspaceId: WorkspaceId): void {
    const workspace = this.workspaces.get(workspaceId);
    if (!workspace) {
      return;
    }

    for (const listenerId of workspace.workspaceListeners.keys()) {
      this.listenerIndex.delete(listenerId);
    }
    for (const channel of workspace.channels.values()) {
      this.channelOwnership.delete(channel.channelId);
      for (const listenerId of channel.listeners.keys()) {
        this.listenerIndex.delete(listenerId);
      }
    }
    this.workspaces.delete(workspaceId);
  }

  private emit(
    listeners: IterableIterator<ContextListenerDescriptor>,
    envelope: WorkspaceContextEnvelope,
  ): void {
    for (const descriptor of listeners) {
      if (!this.matchesFilter(descriptor.filter, envelope.context.type)) {
        continue;
      }
      try {
        descriptor.handler(envelope.context);
      } catch (error) {
        // Swallow listener errors to avoid breaking unrelated listeners.
        console.warn(
          "[WorkspaceContextBusService] listener execution failed",
          descriptor.id,
          error,
        );
      }
    }
  }

  private ensureWorkspace(workspaceId: WorkspaceId): WorkspaceState {
    let workspace = this.workspaces.get(workspaceId);
    if (!workspace) {
      workspace = {
        workspaceId,
        channels: new Map(),
        workspaceListeners: new Map(),
      };
      this.workspaces.set(workspaceId, workspace);
    }

    return workspace;
  }

  private ensureChannel(workspace: WorkspaceState, channelId: ChannelId): ChannelState {
    let channel = workspace.channels.get(channelId);
    if (!channel) {
      this.channelOwnership.set(channelId, workspace.workspaceId);
      channel = {
        workspaceId: workspace.workspaceId,
        channelId,
        members: new Map<AppInstanceId, ChannelMember>(),
        listeners: new Map(),
      };
      workspace.channels.set(channelId, channel);
    }

    return channel;
  }

  private nextListenerId(workspaceId: WorkspaceId): ContextListenerId {
    this.listenerCounter += 1;
    return `ctx:${workspaceId}:${this.listenerCounter}`;
  }

  private matchesFilter(filter: ContextFilter, contextType?: string): boolean {
    if (!filter || filter === "*" || filter === null) {
      return true;
    }
    if (!contextType) {
      return false;
    }
    return filter === contextType;
  }

  private assertChannelOwnership(workspaceId: WorkspaceId, channelId: ChannelId): void {
    const owner = this.channelOwnership.get(channelId);
    if (owner && owner !== workspaceId) {
      throw new Error(
        `Channel ${channelId} belongs to workspace ${owner}; attempted access from workspace ${workspaceId}`,
      );
    }
  }
}

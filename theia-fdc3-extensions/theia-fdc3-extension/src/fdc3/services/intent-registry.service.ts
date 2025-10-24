import { injectable } from "@theia/core/shared/inversify";
import type { AppIdentifier, IntentHandler } from "@finos/fdc3";
import type { ContextFilter } from "@theia-fdc3/fdc3/types/context.interface";
import {
  type IntentListenerDescriptor,
  type IntentListenerId,
  type IntentName,
} from "@theia-fdc3/fdc3/types/intent.interface";
import type { WorkspaceId } from "@theia-fdc3/fdc3/types/channel.interface";

interface WorkspaceIntentState {
  readonly intents: Map<IntentName, Map<IntentListenerId, IntentListenerDescriptor>>;
}

interface ListenerLocation {
  readonly workspaceId: WorkspaceId;
  readonly intent: IntentName;
}

@injectable()
export class IntentRegistryService {
  private readonly workspaces = new Map<WorkspaceId, WorkspaceIntentState>();
  private readonly listenerIndex = new Map<IntentListenerId, ListenerLocation>();
  private listenerCounter = 0;

  registerListener(
    workspaceId: WorkspaceId,
    intent: IntentName,
    handler: IntentHandler,
    contextFilter: ContextFilter,
    source?: AppIdentifier,
  ): IntentListenerDescriptor {
    const workspace = this.ensureWorkspace(workspaceId);
    const intentListeners = this.ensureIntent(workspace, intent);
    const id = this.nextListenerId(workspaceId);

    const descriptor: IntentListenerDescriptor = {
      id,
      intent,
      workspaceId,
      handler,
      contextFilter,
      source,
    };

    intentListeners.set(id, descriptor);
    this.listenerIndex.set(id, { workspaceId, intent });
    return descriptor;
  }

  removeListener(listenerId: IntentListenerId): boolean {
    const location = this.listenerIndex.get(listenerId);
    if (!location) {
      return false;
    }

    const workspace = this.workspaces.get(location.workspaceId);
    const intentListeners = workspace?.intents.get(location.intent);
    if (!intentListeners) {
      this.listenerIndex.delete(listenerId);
      return false;
    }

    const removed = intentListeners.delete(listenerId);
    if (intentListeners.size === 0) {
      workspace?.intents.delete(location.intent);
    }
    if (workspace && workspace.intents.size === 0) {
      this.workspaces.delete(location.workspaceId);
    }

    this.listenerIndex.delete(listenerId);
    return removed;
  }

  getListeners(workspaceId: WorkspaceId, intent: IntentName): IntentListenerDescriptor[] {
    const workspace = this.workspaces.get(workspaceId);
    if (!workspace) {
      return [];
    }

    const listeners = workspace.intents.get(intent);
    if (!listeners) {
      return [];
    }

    return Array.from(listeners.values());
  }

  getIntentListener(id: IntentListenerId): IntentListenerDescriptor | undefined {
    const location = this.listenerIndex.get(id);
    if (!location) {
      return undefined;
    }

    const workspace = this.workspaces.get(location.workspaceId);
    return workspace?.intents.get(location.intent)?.get(id);
  }

  getIntentsForWorkspace(workspaceId: WorkspaceId): Array<[IntentName, IntentListenerDescriptor[]]> {
    const workspace = this.workspaces.get(workspaceId);
    if (!workspace) {
      return [];
    }
    return Array.from(workspace.intents.entries()).map(([intentName, listeners]) => [
      intentName,
      Array.from(listeners.values()),
    ]);
  }

  private ensureWorkspace(workspaceId: WorkspaceId): WorkspaceIntentState {
    let workspace = this.workspaces.get(workspaceId);
    if (!workspace) {
      workspace = { intents: new Map() };
      this.workspaces.set(workspaceId, workspace);
    }
    return workspace;
  }

  private ensureIntent(workspace: WorkspaceIntentState, intent: IntentName) {
    let listeners = workspace.intents.get(intent);
    if (!listeners) {
      listeners = new Map();
      workspace.intents.set(intent, listeners);
    }
    return listeners;
  }

  private nextListenerId(workspaceId: WorkspaceId): IntentListenerId {
    this.listenerCounter += 1;
    return `intent:${workspaceId}:${this.listenerCounter}`;
  }
}


import { injectable } from "@theia/core/shared/inversify";
import type { WorkspaceId } from "@theia-fdc3/fdc3/types/channel.interface";

export interface WorkspaceResolver {
  getActiveWorkspaceId(): WorkspaceId;
  setActiveWorkspace(workspaceId: WorkspaceId): void;
}

@injectable()
export class InMemoryWorkspaceResolver implements WorkspaceResolver {
  private activeWorkspaceId: WorkspaceId = "default";

  getActiveWorkspaceId(): WorkspaceId {
    return this.activeWorkspaceId;
  }

  setActiveWorkspace(workspaceId: WorkspaceId): void {
    this.activeWorkspaceId = workspaceId;
  }
}


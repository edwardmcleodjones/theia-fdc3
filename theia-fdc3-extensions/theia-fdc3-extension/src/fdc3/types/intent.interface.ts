import type {
  AppIdentifier,
  AppIntent,
  Context,
  IntentHandler,
  IntentResolution,
} from "@finos/fdc3";
import type { ContextFilter } from "./context.interface";
import type { WorkspaceId } from "./channel.interface";

/** Name of an FDC3 intent. */
export type IntentName = string;
/** Unique identifier assigned to intent listeners. */
export type IntentListenerId = string;

/**
 * Describes a registered intent listener within a workspace and retains enough
 * metadata for resolution and auditing.
 */
export interface IntentListenerDescriptor {
  readonly id: IntentListenerId;
  readonly intent: IntentName;
  readonly workspaceId: WorkspaceId;
  readonly handler: IntentHandler;
  readonly contextFilter: ContextFilter;
  readonly source?: AppIdentifier;
}

/**
 * Normalised entry describing an app's ability to handle intents. Used by the
 * registry service to resolve handlers.
 */
export interface IntentRegistryEntry {
  readonly intent: IntentName;
  readonly contexts: ContextFilter[];
  readonly app: AppIdentifier;
  readonly displayName?: string;
}

/**
 * Result object returned by the registry when a single handler is resolved.
 */
export interface IntentResolutionResult {
  readonly handler: IntentListenerDescriptor;
  readonly resolution: IntentResolution;
}

/** Describes an intent lookup operation. */
export interface IntentQuery {
  readonly intent: IntentName;
  readonly context?: Context | null;
}

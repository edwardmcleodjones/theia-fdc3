import type { IntentName } from "@theia-fdc3/fdc3/types/intent.interface";
import type { ContextFilter } from "@theia-fdc3/fdc3/types/context.interface";

export interface IntentModel {
  readonly name: IntentName;
  readonly displayName?: string;
  readonly contexts: ContextFilter[];
}


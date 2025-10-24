import type { AppIdentifier } from "@finos/fdc3";
import type { IntentName } from "@theia-fdc3/fdc3/types/intent.interface";

export interface IntentResolutionModel {
  readonly intent: IntentName;
  readonly chosenApp: AppIdentifier;
  readonly outcome: "delivered" | "rejected" | "deferred";
  readonly timestamp: number;
}


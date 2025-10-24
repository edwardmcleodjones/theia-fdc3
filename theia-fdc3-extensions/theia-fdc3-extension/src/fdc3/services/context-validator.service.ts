import { injectable } from "@theia/core/shared/inversify";
import type { Context } from "@finos/fdc3";
import type { ContextFilter } from "@theia-fdc3/fdc3/types/context.interface";

@injectable()
export class ContextValidatorService {
  validate(context: Context): void {
    if (!context || typeof context !== "object") {
      throw new Error("Context must be an object.");
    }

    if (typeof context.type !== "string" || context.type.trim().length === 0) {
      throw new Error("Context.type must be a non-empty string.");
    }
  }

  matchesFilter(context: Context, filter: ContextFilter | null): boolean {
    if (!filter || filter === "*" || filter === null) {
      return true;
    }

    return context.type === filter;
  }
}


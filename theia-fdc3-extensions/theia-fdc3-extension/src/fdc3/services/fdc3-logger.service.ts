import { injectable } from "@theia/core/shared/inversify";
import type { Context } from "@finos/fdc3";

type LogLevel = "DEBUG" | "INFO" | "WARN" | "ERROR";

@injectable()
export class Fdc3LoggerService {
  private readonly redactedKeys = new Set(["payload", "data", "details"]);

  debug(message: string, metadata?: Record<string, unknown>): void {
    this.emit("DEBUG", message, metadata);
  }

  info(message: string, metadata?: Record<string, unknown>): void {
    this.emit("INFO", message, metadata);
  }

  warn(message: string, metadata?: Record<string, unknown>): void {
    this.emit("WARN", message, metadata);
  }

  error(message: string, metadata?: Record<string, unknown>): void {
    this.emit("ERROR", message, metadata);
  }

  summarizeContext(context: Context | undefined): Record<string, unknown> | undefined {
    if (!context) {
      return undefined;
    }
    const summary: Record<string, unknown> = {
      type: context.type,
    };
    if (context.id) {
      summary.id = this.maskSensitive(context.id);
    }
    return summary;
  }

  private emit(level: LogLevel, message: string, metadata?: Record<string, unknown>): void {
    const entry = {
      level,
      message,
      ...(metadata ? { metadata: this.maskSensitive(metadata) } : {}),
      timestamp: new Date().toISOString(),
    };

    switch (level) {
      case "DEBUG":
        console.debug(entry);
        break;
      case "INFO":
        console.info(entry);
        break;
      case "WARN":
        console.warn(entry);
        break;
      case "ERROR":
        console.error(entry);
        break;
    }
  }

  private maskSensitive<T>(value: T): T {
    if (!value) {
      return value;
    }

    if (Array.isArray(value)) {
      return value.map((item) => this.maskSensitive(item)) as unknown as T;
    }

    if (typeof value === "object") {
      const result: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(value)) {
        if (this.redactedKeys.has(key)) {
          result[key] = "[redacted]";
          continue;
        }
        result[key] = this.maskSensitive(val);
      }
      return result as unknown as T;
    }

    return value;
  }
}


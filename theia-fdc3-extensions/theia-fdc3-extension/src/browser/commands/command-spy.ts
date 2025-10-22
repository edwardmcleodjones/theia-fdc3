import {
  CommandRegistry,
  type CommandContribution,
} from "@theia/core/lib/common/command";
import { injectable } from "@theia/core/shared/inversify";

@injectable()
export class CommandSpyContribution implements CommandContribution {
  registerCommands(registry: CommandRegistry): void {
    const original = registry.executeCommand.bind(registry);

    registry.executeCommand = async (name: string, ...args: any[]) => {
      console.log(
        "[THEIA-FDC3] Command executed: %c%s%c with args:",
        "color: #1976d2; font-weight: bold;",
        name,
        "",
        args
      );

      return original(name, ...args);
    };
  }
}

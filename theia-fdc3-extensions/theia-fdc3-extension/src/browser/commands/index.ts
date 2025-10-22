import { CommandContribution } from "@theia/core/lib/common/command";

import { CommandSpyContribution } from "./command-spy";
import { registerCommands } from "./register-command-contribution";
import { unregisterCommands } from "./unregister-commands-contribution";

import type { interfaces } from "inversify";

export function initCommands({
  bind,
  rebind,
}: {
  bind: interfaces.Bind;
  rebind: interfaces.Rebind;
}): void {
  //// TODO: Use the following to register or unregister commands:
  // unregisterCommands({ bind, rebind });
  // registerCommands({ bind, rebind });

  // Log all command executions (DEV)
  bind(CommandContribution).to(CommandSpyContribution).inSingletonScope();
}

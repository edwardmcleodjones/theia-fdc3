/**
 * Generated using theia-extension-generator
 */
import {
  TheiaFdc3ExtensionCommandContribution,
  TheiaFdc3ExtensionMenuContribution,
} from "./theia-fdc3-extension-contribution";
import { CommandContribution, MenuContribution } from "@theia/core/lib/common";
import { ContainerModule } from "@theia/core/shared/inversify";

import { initCommands } from "./commands";
import { registerFilters } from "./contribution-filters";
import { initApplicationShell } from "./layout/application-shell";

export default new ContainerModule((bind, unbind, isBound, rebind) => {
  // Register contribution filters
  registerFilters({ bind, rebind });

  // Register or unregister commands and menus
  // TODO: Actually register/unregister commands as needed
  // Currently, we just log all command executions for development purposes
  initCommands({ bind, rebind });

  // TODO: Use as a base for less IDE feeling layout.
  //// Shell: Theme with gaps layout
  // initApplicationShell({ bind, rebind });

  // add your contribution bindings here
  bind(CommandContribution).to(TheiaFdc3ExtensionCommandContribution);
  bind(MenuContribution).to(TheiaFdc3ExtensionMenuContribution);
});

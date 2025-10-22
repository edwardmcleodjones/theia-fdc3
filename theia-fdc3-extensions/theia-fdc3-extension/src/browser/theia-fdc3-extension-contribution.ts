import { injectable, inject } from "@theia/core/shared/inversify";
import {
  Command,
  CommandContribution,
  CommandRegistry,
  MenuContribution,
  MenuModelRegistry,
  MessageService,
} from "@theia/core/lib/common";
import { CommonMenus } from "@theia/core/lib/browser";

export const TheiaFdc3ExtensionCommand: Command = {
  id: "TheiaFdc3Extension.command",
  label: "Say Hello 1",
};

@injectable()
export class TheiaFdc3ExtensionCommandContribution
  implements CommandContribution
{
  @inject(MessageService)
  protected readonly messageService!: MessageService;

  registerCommands(registry: CommandRegistry): void {
    registry.registerCommand(TheiaFdc3ExtensionCommand, {
      execute: () => this.messageService.info("Hello World!"),
    });
  }
}

@injectable()
export class TheiaFdc3ExtensionMenuContribution implements MenuContribution {
  registerMenus(menus: MenuModelRegistry): void {
    menus.registerMenuAction(CommonMenus.EDIT_FIND, {
      commandId: TheiaFdc3ExtensionCommand.id,
      label: TheiaFdc3ExtensionCommand.label,
    });
  }
}

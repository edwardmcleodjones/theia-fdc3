import { injectable } from "@theia/core/shared/inversify";
import {
  AbstractViewContribution,
  CommonMenus,
} from "@theia/core/lib/browser";
import {
  Command,
  CommandRegistry,
} from "@theia/core/lib/common/command";
import { MenuModelRegistry } from "@theia/core/lib/common/menu";

import { ClientPickerWidgetWidget } from "./client-picker-widget-widget";

export const ClientPickerCommand: Command = {
  id: "clientPicker:open",
  category: "FDC3",
  label: "Open Client Picker",
};

@injectable()
export class ClientPickerContribution extends AbstractViewContribution<ClientPickerWidgetWidget> {
  constructor() {
    super({
      widgetId: ClientPickerWidgetWidget.ID,
      widgetName: ClientPickerWidgetWidget.LABEL,
      defaultWidgetOptions: {
        area: "left",
        rank: 500,
      },
      toggleCommandId: ClientPickerCommand.id,
    });
  }

  registerCommands(registry: CommandRegistry): void {
    registry.registerCommand(ClientPickerCommand, {
      execute: () =>
        this.openView({
          activate: true,
          reveal: true,
        }),
    });
  }

  registerMenus(menus: MenuModelRegistry): void {
    super.registerMenus(menus);
    menus.registerMenuAction(CommonMenus.VIEW_VIEWS, {
      commandId: ClientPickerCommand.id,
      label: ClientPickerCommand.label,
      order: "4",
    });
  }
}

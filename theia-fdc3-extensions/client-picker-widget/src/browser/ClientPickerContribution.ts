import { inject, injectable, optional } from "@theia/core/shared/inversify";
import { AbstractViewContribution, CommonMenus, FrontendApplicationContribution } from "@theia/core/lib/browser";
import {
  Command,
  CommandRegistry,
} from "@theia/core/lib/common/command";
import { MenuModelRegistry } from "@theia/core/lib/common/menu";
import { OutputChannelManager } from "@theia/output/lib/browser/output-channel";
import type { FrontendApplication } from "@theia/core/lib/browser/frontend-application";

import { ClientPickerWidgetWidget } from "./client-picker-widget-widget";
import { CLIENT_PICKER_OUTPUT_CHANNEL } from "./clients";

export const ClientPickerCommand: Command = {
  id: "clientPicker:open",
  category: "FDC3",
  label: "Open Client Picker",
};

@injectable()
export class ClientPickerContribution
  extends AbstractViewContribution<ClientPickerWidgetWidget>
  implements FrontendApplicationContribution
{
  @inject(OutputChannelManager)
  @optional()
  protected readonly outputChannelManager?: OutputChannelManager;

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

  async onStart(_app: FrontendApplication): Promise<void> {
    const manager = this.outputChannelManager;
    if (!manager) {
      return;
    }
    const channel = manager.getChannel(CLIENT_PICKER_OUTPUT_CHANNEL);
    manager.selectedChannel = channel;
  }
}

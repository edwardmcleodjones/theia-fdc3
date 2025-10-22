import {
  ApplicationShell as TheiaApplicationShell,
  CommonCommands,
  CommonMenus,
} from "@theia/core/lib/browser";
import {
  Command,
  CommandContribution,
  CommandRegistry,
  MenuContribution,
  MenuModelRegistry,
  MessageService,
  nls,
} from "@theia/core/lib/common";
import {
  inject,
  injectable,
  type interfaces,
} from "@theia/core/shared/inversify";
import { EditorCommands } from "@theia/editor/lib/browser";
import { FileNavigatorContribution } from "@theia/navigator/lib/browser/navigator-contribution";
import { OutputContribution } from "@theia/output/lib/browser/output-contribution";
import { SearchInWorkspaceFrontendContribution } from "@theia/search-in-workspace/lib/browser/search-in-workspace-frontend-contribution";
import { TerminalCommands } from "@theia/terminal/lib/browser/terminal-frontend-contribution";
import { WorkspaceCommands } from "@theia/workspace/lib/browser";

// TODO: Restore after adding layout management...
// import { ApplicationShell } from '../layout/application-shell';

export const SHOW_EXPLORER_COMMAND = Command.toLocalizedCommand({
  id: "fileNavigator:activate",
  label: "Files",
});

export const SHOW_SEARCH_COMMAND = Command.toLocalizedCommand({
  id: "searchInWorkspace:activate",
  label: "Search",
});

export const TOGGLE_OUTPUT_COMMAND = Command.toLocalizedCommand({
  id: "output:toggle",
  label: "Toggle Output",
});

// Register commands
@injectable()
export class FlexbeUiCommandContribution implements CommandContribution {
  // @inject(TheiaApplicationShell)
  // protected readonly shell: ApplicationShell;

  @inject(MessageService)
  protected readonly messageService!: MessageService;

  @inject(FileNavigatorContribution)
  protected readonly fileNavigatorContribution!: FileNavigatorContribution;

  @inject(SearchInWorkspaceFrontendContribution)
  protected readonly searchInWorkspaceFrontendContribution!: SearchInWorkspaceFrontendContribution;

  @inject(OutputContribution)
  protected readonly outputContribution!: OutputContribution;

  registerCommands(commands: CommandRegistry): void {
    commands.registerCommand(SHOW_EXPLORER_COMMAND, {
      execute: async () =>
        this.fileNavigatorContribution.openView({
          activate: true,
          reveal: true,
        }),
    });

    commands.registerCommand(SHOW_SEARCH_COMMAND, {
      execute: async () =>
        this.searchInWorkspaceFrontendContribution.openView({
          activate: true,
          reveal: true,
        }),
    });

    // commands.registerCommand(TOGGLE_OUTPUT_COMMAND, {
    // execute: async() => this.outputContribution.openView({ activate: true, reveal: true }),
    // });

    // No-op for NEW_UNTITLED_FILE_COMMAND to prevent behavior on double click
    commands.registerCommand(CommonCommands.NEW_UNTITLED_TEXT_FILE, {
      execute: () => null,
    });
  }
}

// Register menus
@injectable()
export class FlexbeUiMenuContribution implements MenuContribution {
  registerMenus(menus: MenuModelRegistry): void {
    // Recreate: Menu -> View
    menus.registerSubmenu(CommonMenus.VIEW, nls.localizeByDefault("View"));

    // Menu -> File -> New file...
    menus.registerMenuAction(CommonMenus.FILE_NEW_TEXT, {
      commandId: WorkspaceCommands.NEW_FILE.id,
      order: "a",
    });

    // Menu -> View -> Explorer
    menus.registerMenuAction(CommonMenus.VIEW_VIEWS, {
      commandId: SHOW_EXPLORER_COMMAND.id,
      label: SHOW_EXPLORER_COMMAND.label,
      order: "a",
    });

    // Menu -> View -> Search
    menus.registerMenuAction(CommonMenus.VIEW_VIEWS, {
      commandId: SHOW_SEARCH_COMMAND.id,
      label: SHOW_SEARCH_COMMAND.label,
      order: "b",
    });

    // Menu -> View -> Output
    menus.registerMenuAction(CommonMenus.VIEW_VIEWS, {
      commandId: TOGGLE_OUTPUT_COMMAND.id,
      label: TOGGLE_OUTPUT_COMMAND.label,
      order: "c",
    });

    // Menu -> View -> Terminal
    menus.registerMenuAction(CommonMenus.VIEW_VIEWS, {
      commandId: TerminalCommands.TOGGLE_TERMINAL.id,
      label: TerminalCommands.TOGGLE_TERMINAL.label,
      order: "d",
    });

    // Menu -> View -> Split view
    menus.registerMenuAction(CommonMenus.VIEW_LAYOUT, {
      commandId: EditorCommands.SPLIT_EDITOR_HORIZONTAL.id,
      label: EditorCommands.SPLIT_EDITOR_HORIZONTAL.label,
    });
  }
}

export function registerCommands({
  bind,
  rebind,
}: {
  bind: interfaces.Bind;
  rebind: interfaces.Rebind;
}): void {
  bind(CommandContribution).to(FlexbeUiCommandContribution).inSingletonScope();
  bind(MenuContribution).to(FlexbeUiMenuContribution).inSingletonScope();
}

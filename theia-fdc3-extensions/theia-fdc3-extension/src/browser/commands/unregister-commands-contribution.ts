import { CommonCommands, CommonMenus, KeyboardCommands } from '@theia/core/lib/browser';
import { CommandContribution, MenuContribution, type CommandRegistry, type MenuModelRegistry } from '@theia/core/lib/common';
import { injectable, type interfaces } from '@theia/core/shared/inversify';
import { EditorCommands, EditorMainMenu } from '@theia/editor/lib/browser';
import { FileDownloadCommands } from '@theia/filesystem/lib/browser/download/file-download-command-contribution';
import { MonacoMenus } from '@theia/monaco/lib/browser/monaco-menu';
import { FileNavigatorCommands } from '@theia/navigator/lib/browser/file-navigator-commands';
import { OpenEditorsCommands } from '@theia/navigator/lib/browser/open-editors-widget/navigator-open-editors-commands';
import { PreferencesCommands } from '@theia/preferences/lib/browser/util/preference-types';
import { TerminalCommands, TerminalMenus } from '@theia/terminal/lib/browser/terminal-frontend-contribution';
import { WorkspaceCommands } from '@theia/workspace/lib/browser';


// Kill commands and menus
@injectable()
export class UnregisterCommandsContribution implements CommandContribution, MenuContribution {
    registerCommands(commands: CommandRegistry): void {
        // About menu
        commands.unregisterCommand(CommonCommands.ABOUT_COMMAND);

        // File actions
        commands.unregisterCommand(CommonCommands.OPEN_VIEW); // Open file dialog
        commands.unregisterCommand(FileDownloadCommands.COPY_DOWNLOAD_LINK);

        commands.unregisterCommand(WorkspaceCommands.OPEN);
        commands.unregisterCommand(WorkspaceCommands.OPEN_FILE);
        commands.unregisterCommand(WorkspaceCommands.OPEN_FOLDER);
        commands.unregisterCommand(WorkspaceCommands.ADD_FOLDER);
        commands.unregisterCommand(WorkspaceCommands.CLOSE);

        commands.unregisterCommand(WorkspaceCommands.OPEN_WORKSPACE);
        commands.unregisterCommand(WorkspaceCommands.OPEN_WORKSPACE_FILE);
        commands.unregisterCommand(WorkspaceCommands.OPEN_RECENT_WORKSPACE);
        commands.unregisterCommand(WorkspaceCommands.SAVE_WORKSPACE_AS);
        commands.unregisterCommand(FileNavigatorCommands.TOGGLE_HIDDEN_FILES);
        commands.unregisterCommand(FileNavigatorCommands.TOGGLE_AUTO_REVEAL);
        commands.unregisterCommand(FileNavigatorCommands.OPEN_WITH);

        // Choose keyboard layout
        commands.unregisterCommand(KeyboardCommands.CHOOSE_KEYBOARD_LAYOUT);

        // Terminal
        commands.unregisterCommand(TerminalCommands.PROFILE_NEW);
        commands.unregisterCommand(TerminalCommands.PROFILE_DEFAULT);
        commands.unregisterCommand(TerminalCommands.NEW_ACTIVE_WORKSPACE);
        commands.unregisterCommand(TerminalCommands.TERMINAL_CONTEXT);
        commands.unregisterCommand(TerminalCommands.SPLIT);
        commands.unregisterCommand(TerminalCommands.SELECT_ALL);
        commands.unregisterCommand(TerminalCommands.SHOW_ALL_OPENED_TERMINALS);

        commands.unregisterCommand(CommonCommands.ABOUT_COMMAND);
        commands.unregisterCommand(CommonCommands.NEW_UNTITLED_TEXT_FILE);
        commands.unregisterCommand(CommonCommands.PICK_NEW_FILE);
        commands.unregisterCommand(CommonCommands.COPY_PATH); // Remove copy path (leave only relative path)
        commands.unregisterCommand(CommonCommands.AUTO_SAVE);

        commands.unregisterCommand(CommonCommands.NEXT_TAB);
        commands.unregisterCommand(CommonCommands.PREVIOUS_TAB);
        commands.unregisterCommand(CommonCommands.CLOSE_OTHER_TABS);
        commands.unregisterCommand(CommonCommands.CLOSE_OTHER_MAIN_TABS);
        commands.unregisterCommand(CommonCommands.CLOSE_SAVED_TABS);
        commands.unregisterCommand(CommonCommands.CLOSE_RIGHT_TABS);
        commands.unregisterCommand(CommonCommands.CLOSE_MAIN_TAB);
        commands.unregisterCommand(CommonCommands.CLOSE_ALL_TABS);
        commands.unregisterCommand(CommonCommands.CLOSE_ALL_MAIN_TABS);

        // Layout
        commands.unregisterCommand(CommonCommands.COLLAPSE_PANEL);
        commands.unregisterCommand(CommonCommands.COLLAPSE_ALL_PANELS);
        commands.unregisterCommand(CommonCommands.TOGGLE_LEFT_PANEL);
        commands.unregisterCommand(CommonCommands.TOGGLE_RIGHT_PANEL);

        commands.unregisterCommand(CommonCommands.PIN_TAB);
        commands.unregisterCommand(CommonCommands.UNPIN_TAB);
        commands.unregisterCommand(CommonCommands.SHOW_MENU_BAR);
        commands.unregisterCommand(CommonCommands.CONFIGURE_DISPLAY_LANGUAGE);

        // Editor groups
        commands.unregisterCommand('workbench.action.reloadWindow');
        commands.unregisterCommand('workbench.action.focusFirstEditorGroup');
        commands.unregisterCommand('workbench.action.focusSecondEditorGroup');
        commands.unregisterCommand('workbench.action.focusThirdEditorGroup');
        commands.unregisterCommand('workbench.action.focusFourthEditorGroup');
        commands.unregisterCommand('workbench.action.focusFifthEditorGroup');
        commands.unregisterCommand(CommonCommands.NEXT_TAB_GROUP);
        commands.unregisterCommand(CommonCommands.NEXT_TAB_IN_GROUP);
        commands.unregisterCommand(CommonCommands.PREVIOUS_TAB_GROUP);
        commands.unregisterCommand(CommonCommands.PREVIOUS_TAB_IN_GROUP);

        // Toggles
        commands.unregisterCommand(CommonCommands.TOGGLE_MAXIMIZED);
        commands.unregisterCommand(CommonCommands.TOGGLE_BREADCRUMBS);
        commands.unregisterCommand(EditorCommands.TOGGLE_RENDER_WHITESPACE);
        commands.unregisterCommand(EditorCommands.TOGGLE_WORD_WRAP);
        commands.unregisterCommand(EditorCommands.TOGGLE_MINIMAP);
        commands.unregisterCommand(EditorCommands.TOGGLE_STICKY_SCROLL);
        commands.unregisterCommand(EditorCommands.CONFIG_EOL);
        commands.unregisterCommand(EditorCommands.REVERT_AND_CLOSE);
        commands.unregisterCommand(EditorCommands.SHOW_ALL_OPENED_EDITORS);

        commands.unregisterCommand(EditorCommands.SPLIT_EDITOR_LEFT);
        commands.unregisterCommand(EditorCommands.SPLIT_EDITOR_RIGHT);
        commands.unregisterCommand(EditorCommands.SPLIT_EDITOR_DOWN);
        commands.unregisterCommand(EditorCommands.SPLIT_EDITOR_UP);
        commands.unregisterCommand(EditorCommands.SPLIT_EDITOR_VERTICAL);
        // commands.unregisterCommand(EditorCommands.SPLIT_EDITOR_HORIZONTAL); // This is allowed

        commands.unregisterCommand(OpenEditorsCommands.CLOSE_ALL_TABS_FROM_TOOLBAR);
        commands.unregisterCommand(OpenEditorsCommands.SAVE_ALL_TABS_FROM_TOOLBAR);
        commands.unregisterCommand(OpenEditorsCommands.CLOSE_ALL_EDITORS_IN_GROUP_FROM_ICON);
        commands.unregisterCommand(OpenEditorsCommands.SAVE_ALL_IN_GROUP_FROM_ICON);

        // ???
        commands.unregisterCommand('editor.action.toggleHighContrast');
        commands.unregisterCommand('editor.toggleImportFold');
        commands.unregisterCommand('editor.createFoldingRangeFromSelection');
        commands.unregisterCommand('editor.action.wordHighlight.trigger');
        commands.unregisterCommand('editor.action.transposeLetters');

        // Preferences
        commands.unregisterCommand(PreferencesCommands.OPEN_WORKSPACE_PREFERENCES);
        commands.unregisterCommand(PreferencesCommands.OPEN_WORKSPACE_PREFERENCES_JSON);
        commands.unregisterCommand(PreferencesCommands.OPEN_FOLDER_PREFERENCES);
        commands.unregisterCommand(PreferencesCommands.OPEN_FOLDER_PREFERENCES_JSON);

        // User settings (UI)
        // commands.unregisterCommand(CommonCommands.OPEN_PREFERENCES);
        // commands.unregisterCommand(PreferencesCommands.OPEN_USER_PREFERENCES);
        // commands.unregisterCommand(PreferencesCommands.OPEN_USER_PREFERENCES_JSON);
        // commands.unregisterCommand(CommonCommands.SELECT_COLOR_THEME);
        // commands.unregisterCommand(CommonCommands.SELECT_ICON_THEME);

        // Reset layout
        // commands.unregisterCommand(RESET_LAYOUT.id);
    }

    registerMenus(menus: MenuModelRegistry): void {
        // Menu -> Terminal
        menus.unregisterMenuAction(TerminalMenus.TERMINAL.at(-1) as string, TerminalMenus.TERMINAL.slice(0, -1));

        // Menu -> Help
        menus.unregisterMenuAction(CommonMenus.HELP.at(-1) as string, CommonMenus.HELP.slice(0, -1));

        // Menu -> File -> Preferences submenu
        menus.unregisterMenuAction(CommonMenus.FILE_SETTINGS_SUBMENU.at(-1) as string, CommonMenus.FILE_SETTINGS_SUBMENU.slice(0, -1));

        // Menu -> Go -> Switch group
        menus.unregisterMenuAction(EditorMainMenu.PANE_GROUP.at(-1) as string, EditorMainMenu.PANE_GROUP.slice(0, -1));
        // Menu -> Go -> Next/Previous problem
        menus.unregisterMenuAction(MonacoMenus.MARKERS_GROUP.at(-1) as string, MonacoMenus.MARKERS_GROUP.slice(0, -1));

        // Menu -> Selection
        menus.unregisterMenuAction(MonacoMenus.SELECTION.at(-1) as string, MonacoMenus.SELECTION.slice(0, -1));

        // File Context Menu -> Peek
        menus.unregisterMenuAction(MonacoMenus.PEEK_CONTEXT_SUBMENU.at(-1) as string, MonacoMenus.PEEK_CONTEXT_SUBMENU.slice(0, -1));

        // File Tree -> Add folder to workspace
        menus.unregisterMenuAction(FileNavigatorCommands.ADD_ROOT_FOLDER);

        // Menu -> View (will be recreated)
        menus.unregisterMenuAction(CommonMenus.VIEW.at(-1) as string, CommonMenus.VIEW.slice(0, -1));
    }
}

export function unregisterCommands({ bind, rebind }: { bind: interfaces.Bind; rebind: interfaces.Rebind }): void {
    bind(CommandContribution).to(UnregisterCommandsContribution).inSingletonScope();
    bind(MenuContribution).to(UnregisterCommandsContribution).inSingletonScope();
}

# Theia-Based FDC3 Workspace Platform

## Tasks

Below is a structured list of development tasks derived from the plan. These tasks are ordered in a logical implementation sequence:

1.  **Implement Workspace Manager Extension:** Create the extension for managing multiple workspaces (contexts).
    - Design the UI for workspace tabs: This will be a new widget above the main content area. Theia's existing `Dynamic Toolbar` should be duplicated as `WorkspaceTabsWidget` and the copied code converted to display a tab for each open workspace and a “+” button to create new one. See: https://theia-ide.org/docs/toolbar/ and https://theia-ide.org/docs/user_toolbar/
    - Handle workspace creation: When user clicks “+” or invokes a command, create a new workspace context (generate an ID, default name). Prompt for a workspace /context name (e.g., client name) using the built-in Theia / VS Code style picker dialog.
    - Handle switching: When a tab is clicked, the extension should hide all widgets belonging to the previous workspace and show widgets for the selected one. (This implies any app opened needs to be associated with a workspace ID. We may need to extend Theia’s Widget class to tag them with workspace context, or maintain a mapping in this extension.) This should initially work using the existing tab functionality that exists in Theia for tabbed documents.
    - Handle closing: On tab close, dispose all widgets of that workspace (closing all apps in it) and remove context listeners related to it.
    - Persist the list of workspaces and their state: To restore on restart, store open workspace names and which apps were open and how they were laid out using the Layouts. This can be presisted to local storage for now, or using the Theia user preferences if that's more appropriate/straightforward.
    - Also create a workspace widget that can show in the left hand sidebar panel (left panel contribution), that lists all the workspaces, and allows them to be renamed, reordered, closed, etc. This be be based on the existing file list widget, and work in a similar way (list of workspaces instead of files, allow renaming, reordering, closing, etc).
    - **Output:** Visible workspace tabs in the UI and the ability to create, switch, and close workspaces (as empty contexts). No context data yet, just the structural aspect.

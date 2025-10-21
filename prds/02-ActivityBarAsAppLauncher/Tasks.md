# Theia-Based FDC3 Workspace Platform

## Tasks

Below is a structured list of development tasks derived from the plan. These tasks are ordered in a logical implementation sequence:

1. **App Launcher/Dock Implementation:** Improve the user experience for launching installed apps.
   - Clone and repurpose the existing Theia/VS Code "Activity bar" as a Dock or App Launcher toolbar – a shortcut bar where installed apps can be pinned for one-click launching, similar to a taskbar. It should show icons for each installed app, with a separator to show which ones are currently in use in the current workspace, and then show the remaining ones which could be launched below.
   - Iterate over all "app" extensions and find those that have a certain flag in their extension manifest or package.json (we can define e.g. `"fdc3-app": true` in extension package to denote a user-launchable app). Then for each, create an icon entry in the app launcher bar. Use some dummy JSON data for now to represent installed apps if needed.
   - Clicking the app entry should open its main view. If it’s a webview extension, that usually means executing a command that the extension registered (like `"extension.openXYZ"`). We might need to coordinate with each app developer to have a standardized open command.
   - Position this launcher to the left of the left hand pane, in the "Activity bar" space.
   - Test by installing the ClientPickerWidget app and launching it via this UI. Also test edge cases: launching the same app twice (initially it should just focuses the existing - we may need a policy here, perhaps allow multiple instances if the extension supports it via a manifest entry, or prevent duplicates).
   - **Output:** A convenient app launching interface that enumerates and opens installed apps, making the workspace truly dynamic for the end user.

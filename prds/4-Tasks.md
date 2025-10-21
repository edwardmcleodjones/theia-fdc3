# Theia-Based FDC3 Workspace Platform

## Tasks

Below is a structured list of development tasks derived from the plan. These tasks are ordered in a logical implementation sequence:

1.  [x] **Project Setup [Complete]** Initialize the custom Theia-based application project.
    - Fork from Theia IDE. Configure the package.json/workspace to prepare for custom extensions (use the Theia Yo generator for a starting extension if needed).
    - Run the build scripts for both browser and Electron targets. Verify that you can run a stock Theia application in both modes.
    - **Output:** A baseline application that launches Theia with default features (we will remove/add features in subsequent steps).
2.  [x]**Create `theia-fdc3-extension` [Complete]**: Set up a new Theia extension project to hold our FDC3-related code.
    - Use the Theia extension generator in a separate folder, then copy the generated files to a new extension folder under `packages/` (e.g., `theia-fdc3-extension`).
    - Configure its package.json with necessary dependencies (e.g., `@theia/core`, `@theia/plugin`, etc.).
    - Set up basic scaffolding: an `index.ts` that registers the extension, and a simple command to verify it loads.
    - **Output:** A skeleton Theia extension ready for FDC3 implementation.
3.  **Remove/Disable Unwanted Features:** In the new `theia-fdc3-extension`, strip out the default Theia IDE functionality that is out-of-scope.
    - Use contribution filters to disable unwanted contributions (e.g., file explorer, text editor, SCM, debug, etc.). This can be done by using Theia’s contribution filtering mechanism.
    - In the application assembly (package.json), remove Theia core extensions related to file system, editor, SCM, debug, etc. (e.g., `@theia/navigator`, `@theia/editor`, and others).
    - Adjust the frontend application configuration to hide any remaining traces (for example, if the menu still shows “File -> Open”, override or remove it).
    - Use these articles as a basis for understanding how to customize Theia: https://dzone.com/articles/theia-deep-dive-build-your-own-ide and https://dzone.com/articles/theia-deep-dive-mastering-customization
    - Test launch to ensure the UI is now minimal – ideally just an empty shell with maybe an empty explorer area and top menu. It should not prompt for opening a workspace folder. _(If Theia complains about no workspace, implement a workaround such as opening a temporary in-memory workspace or patching the workflow.)_
    - **Output:** A “clean” container UI with only barebones elements visible.
4.  **Logging View for Interop:** Implement the logging of messages and events.

    - Use Theia’s OutputChannel service to create a new channel (e.g., “FDC3 Log”). Whenever DesktopAgent handles a broadcast or intent, write a line to this channel. Include timestamp, workspace, type of event, and maybe the payload summary.
    - Add a command or automatic opening of an Output panel for this channel. Possibly, create a custom widget that formats entries nicely (optional enhancement).
    - Test by performing a few context broadcasts/intents and seeing the log output in the UI (will require the DesktopAgent implementation from the next task, and the "Context Selection (Client Picker) Extension" task to fully test).
    - **Output:** A visible log console that updates with FDC3 and context events, assisting in debugging app interactions.

5.  **FDC3 DesktopAgent Extension:** Implement the core FDC3 interoperability features.
    - Define the DesktopAgent API surface (as per FDC3 spec) in TypeScript. Create a class `DesktopAgentImpl` with methods: `broadcast(context)`, `raiseIntent(intent, context, target)`, `addContextListener`, `addIntentListener`, `findIntent(s)`, `getOrCreateChannel`, etc. For now, some methods can be stubs or simplified (e.g., `findIntent` can just search our local registry of listeners). The main methods we're initially interested in are around broadcasts and channels.
    - **Context broadcasting:** Implement `broadcast` to publish the context to all listeners in the same workspace. You can use an event emitter keyed by workspace. For example, an object `workspaceContextBus[workspaceId]` that is an EventEmitter where all context listeners have subscribed. When broadcast is called, emit the event to that bus.
    - **Context listening:** Implement `addContextListener(contextType, handler)`. When an app calls this (through the global fdc3 or via extension API), register the handler to the workspace’s context bus. If a specific `contextType` is provided, the handler should filter events (the extension can do filtering internally: call handler only if `event.type` matches or is subtype).
    - **Intents:** Implement `addIntentListener(intent, handler)` to register an intent consumer (probably store in a map like `workspaceIntents[workspaceId][intent] = handler` or a list of handlers). Implement `raiseIntent(intent, context, target)` to find a handler in the workspace. If `target` (specific app identity) is given, route to that app’s handler only; if not, and if exactly one handler exists, invoke it. If multiple handlers exist and no target, this is where we might need to decide (for now, perhaps invoke the first or show a console warning). The handler invocation could be done via calling the extension’s code directly (if the handler is a callback in the same process) or via command if the target app needs to be brought to front.
    - **Channels:** Implement basic channel management. Create a `Channel` class that has an ID and maybe its own context listener list. We can simplify by equating “workspace = channel” for MVP purposes. So `getOrCreateChannel(id)` either returns an existing workspace channel or creates a new one (if we want to allow custom channels separate from workspaces, we could, but not necessary initially). Ensure `joinUserChannel(channelId)` essentially means “move this app to that workspace context” – however, since our apps won’t roam between workspaces (they belong to the one where opened), this might not be heavily used. We could leave channel APIs as no-ops or just map to workspace join.
    - **Expose `fdc3` to apps:** This is crucial. For any VS Code extension (app) that runs in the Theia plugin host, we need to expose our DesktopAgent through the VS Code API somehow. Perhaps a globally accessible object. E.g., use Theia’s `window` injection. In Electron, inject `window.fdc3 = DesktopAgentImpl` for webviews. For regular non-webview extensions (those running in the backend plugin process), we can make our DesktopAgent available via RPC calls or a custom VS Code extension API (maybe as part of the extension API in Theia).
    - **Testing this extension:** Create a dummy extension or use the ClientPicker (once implemented in the next task) to test broadcasting contexts. Also prepare a second dummy app that calls `fdc3.addContextListener(null, handler)` and log or alert when it receives something, to verify it works.
    - **Output:** The platform now has a working (even if basic) FDC3 DesktopAgent. Apps can call `fdc3.broadcast` or `fdc3.raiseIntent` and the messages are routed to the appropriate listeners in the same workspace. This is the core enabling technology of our platform.
6.  **Context Selection (Client Picker) Extension:** Develop a sample context provider to drive context changes.
    - Create a **ClientPickerWidget** (or similar) as a left panel contribution. This can simply list some dummy context options to start with (e.g., a hardcoded list of client names, using the top 10 companies on the UK stock market).
    - When the user selects an item, this extension should broadcast an FDC3 context object for that client (e.g., `{ type: 'fdc3.client', name: 'NatWest', id: { clientId: 'natwest' } }` ). Use the DesktopAgent API (implemented in the previous Task: "3. FDC3 DesktopAgent Extension").
    - Ensure this broadcast is tagged with the current workspace’s context/channel so that only apps in the same workspace respond.
    - Also, when a new workspace is created, open an instance of the ClientPickerWidget in the left pane automatically (so each workspace has its own independent client selector). This might require the workspace manager to instantiate a new widget for each workspace.
    - **Output:** Output: A functional left sidebar in each workspace where selecting an entry triggers a context broadcast (even if other apps are not yet listening, we should see the action, by logging it so we can see it in Theia's "OutputChannel" log output widget - see Task: "Logging View for Interop").
7.  **Implement Workspace Manager Extension:** Create the extension for managing multiple workspaces (contexts).
    - Design the UI for workspace tabs: This will be a new widget above the main content area. Theia's existing `Dynamic Toolbar` should be duplicated as `WorkspaceTabsWidget` and the copied code converted to display a tab for each open workspace and a “+” button to create new one. See: https://theia-ide.org/docs/toolbar/ and https://theia-ide.org/docs/user_toolbar/
    - Handle workspace creation: When user clicks “+” or invokes a command, create a new workspace context (generate an ID, default name). Prompt for a workspace /context name (e.g., client name) using the built-in Theia / VS Code style picker dialog.
    - Handle switching: When a tab is clicked, the extension should hide all widgets belonging to the previous workspace and show widgets for the selected one. (This implies any app opened needs to be associated with a workspace ID. We may need to extend Theia’s Widget class to tag them with workspace context, or maintain a mapping in this extension.) This should initially work using the existing tab functionality that exists in Theia for tabbed documents.
    - Handle closing: On tab close, dispose all widgets of that workspace (closing all apps in it) and remove context listeners related to it.
    - Persist the list of workspaces and their state: To restore on restart, store open workspace names and which apps were open and how they were laid out using the Layouts. This can be presisted to local storage for now, or using the Theia user preferences if that's more appropriate/straightforward.
    - Also create a workspace widget that can show in the left hand sidebar panel (left panel contribution), that lists all the workspaces, and allows them to be renamed, reordered, closed, etc. This be be based on the existing file list widget, and work in a similar way (list of workspaces instead of files, allow renaming, reordering, closing, etc).
    - **Output:** Visible workspace tabs in the UI and the ability to create, switch, and close workspaces (as empty contexts). No context data yet, just the structural aspect.
8.  **Notifications Integration:** Enable apps to send notifications and handle user interaction from them.
    - Using Theia’s built-in notification (which is usually accessible via `MessageService` or similar with methods like `notify` or `showMessage`), write a small wrapper that apps can call. For VS Code-compatible behavior, we might surface it as part of the DesktopAgent (though FDC3 itself doesn’t define notifications, we can treat them as a special case). Alternatively, provide a global function or command like `app.notify(title, options)`.
    - Ensure that notifications triggered by one app can carry some context such that if the user clicks an action, we know which app or handler to invoke. One design: use FDC3 intents for actions. E.g., a notification “Review order” with a “OpenOrder” button could internally call `raiseIntent("OpenOrder", orderContext)` if clicked.
    - Possibly extend Theia’s Notification widget to include more actions or fields if needed (Theia might support basic actions on notifications out of the box).
    - Test by making a sample app or using an extension API call to raise a notification with a couple of action buttons. Verify the user sees it and that clicking triggers the expected behavior (e.g., logs an entry or opens something).
    - Also implement a "Notifications Center" widget similar to in VS Code (https://code.visualstudio.com/docs/getstarted/userinterface#_reduce-notifications-with-do-not-disturb-mode), where all the notifications can be seen in a list. This should live in the right hand panel by default.
    - **Output:** Apps have the ability to raise user notifications. The user sees these in a consistent manner (likely at the bottom-right or top depending on Theia’s UX). Interactive elements in notifications are connected back to app logic via intents or callbacks. The user can also see all of their notifications in a side panel widget (on the right hand side by default).
9.  **App Store (Extensions Marketplace) Integration:** Connect and configure the Open VSX registry for app discovery.
    - Implement a custom “App Store” view: Repurpose Theia’s built-in Extensions view (If removed, consider re-adding the minimal part required for extension installation). Duplicate this extension and convert the copied code into an "App Store" view instead. The functionality will be the same, but instead of targetting IDE extensions, it will allow for the discovery and installation of "Apps" (which are widgets/webviews packaged as VSIX packages, the same as extensions). We want to duplicate the existing "Extensions" view as we may still want to use that for adding actual extensions, so by creating a new view it keeps the concerns separate, allows for different registries, etc.
    - Instead of actually connecting to a registry at MVP stage, mock up a registry as JSON with a few sample "apps" listed in it, and "connect" to that in the "App Store" view.
    - Test within the running app: open the App Store view, search for a test extension (app) that we know is in our registry. Try installing it via the UI (Theia should download and unpack the VSIX automatically).
    - Confirm the extension activates or appears in the App Launcher. If the extension has a UI part, try launching it to verify installation was successful.
    - **Output:** A working in-app marketplace where users can browse and install new apps (extensions). This completes the self-service loop for extending the platform.
10. **App Launcher/Dock Implementation:** Improve the user experience for launching installed apps.
    - Clone and repurpose the existing Theia/VS Code "Activity bar" as a Dock or App Launcher toolbar – a shortcut bar where installed apps can be pinned for one-click launching, similar to a taskbar. It should show icons for each installed app, with a separator to show which ones are currently in use in the current workspace, and then show the remaining ones which could be launched below.
    - Iterate over all "app" extensions and find those that have a certain flag in their extension manifest or package.json (we can define e.g. `"fdc3-app": true` in extension package to denote a user-launchable app). Then for each, create an icon entry in the app launcher bar.
    - Clicking the app entry should open its main view. If it’s a webview extension, that usually means executing a command that the extension registered (like `"extension.openXYZ"`). We might need to coordinate with each app developer to have a standardized open command.
    - Position this launcher to the left of the left hand pane, in the "Activity bar" space.
    - Test by installing a couple of sample apps and launching them via this UI. Also test edge cases: launching the same app twice (initially it should just focuses the existing - we may need a policy here, perhaps allow multiple instances if the extension supports it via a manifest entry, or prevent duplicates).
    - **Output:** A convenient app launching interface that enumerates and opens installed apps, making the workspace truly dynamic for the end user.
11. **AI Assistant Panel:** Integrate the AI chat functionality into the right sidebar.

    - Theia has an AI extension available: include it in our product and configure it. We want it visible, so consider auto-opening the AI widget on startup. It should live in the right hand sidebar by default.
    - (Optional integration) If possible, feed the current workspace’s context to the AI. This could mean including the last broadcast context in the prompt (if that context is not sensitive and could help the AI answer questions about the current client). This is advanced and might be deferred.
    - Test by asking a simple question in the AI panel and seeing that we get a response (assuming internet connectivity and a valid AI service).
    - **Output:** A functioning AI assistant view that users can interact with. Even if basic, it demonstrates the platform’s extensibility and provides a foundation for smarter features later.

12. **Documentation & Handover:**

    - Prepare developer documentation: how to build and run the platform, how to create a new app extension for it (including how to use the FDC3 API we provide, and how to package apps into VSIX).
    - Prepare user documentation: how to use workspaces, how to install apps from the store, how to use the context linking features, etc.
    - If open-sourcing the project, set up a repository with a clear README, contribution guidelines, and licensing info.
    - Plan next steps (future roadmap features like those deferred, e.g., multi-window, external integration, etc., so the team and community know what’s coming).
    - **Output:** Comprehensive documentation and a clear path for future work, marking the completion of this phase of the project.

13. **Testing and Stabilization:** Perform thorough testing and address issues.

    - Write unit tests for the DesktopAgent’s key methods (simulate multiple listeners, broadcasts, etc.).
    - Simulate a multi-workspace scenario: open two workspaces, each with a context and a couple of apps. Ensure that broadcasting in one does not affect the other.
    - Test installation and usage of a variety of apps: for example, one that only listens to context, one that raises intents, etc. This might involve creating mock/test extensions specifically for testing FDC3 flows.
    - User acceptance testing: get feedback on the UI/UX, refine the layout, tab behaviors, naming (rename “Extensions” view to “App Store”, etc., as needed for clarity).
    - Performance test: measure load time with several extensions, memory usage with multiple apps, etc., and optimize (e.g., lazy load certain extensions or close webviews when not visible).
    - **Output:** A release-candidate version of the platform, with bugs fixed and smooth user experience.

Each task above can be broken down further into sub-tasks during actual development, and tracked in our issue tracker. By completing these tasks in order, we will gradually transform a vanilla Theia IDE into the customized FDC3-enabled workspace platform we envision.

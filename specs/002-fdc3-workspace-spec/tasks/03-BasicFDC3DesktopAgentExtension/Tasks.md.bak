# Theia-Based FDC3 Workspace Platform

## Tasks

Below is a structured list of development tasks derived from the plan. These tasks are ordered in a logical implementation sequence:

1.  **Basic FDC3 DesktopAgent Extension:** Implement a basic set of FDC3 interoperability features.
    - Define the DesktopAgent API surface (as per FDC3 spec) in TypeScript. Create a class `DesktopAgentImpl` with methods: `broadcast(context)`, `raiseIntent(intent, context, target)`, `addContextListener`, `addIntentListener`, `findIntent(s)`, `getOrCreateChannel`, etc. For now, most of the methods can be stubs or simplified. The main methods we're initially interested in are around broadcasts only.
    - **Context broadcasting:** Implement `broadcast` to publish the context to all listeners in the same workspace. You can use an event emitter keyed by workspace. For example, an object `workspaceContextBus[workspaceId]` that is an EventEmitter where all context listeners have subscribed. When broadcast is called, emit the event to that bus.
    - **Context listening:** Implement `addContextListener(contextType, handler)`. When an app calls this (through the global fdc3 or via extension API), register the handler to the workspace’s context bus. If a specific `contextType` is provided, the handler should filter events (the extension can do filtering internally: call handler only if `event.type` matches or is subtype).
    - **Expose `fdc3` to apps:** This is crucial. For any VS Code extension (app) that runs in the Theia plugin host, we need to expose our DesktopAgent through the VS Code API somehow. Perhaps a globally accessible object. E.g., use Theia’s `window` injection. In Electron, inject `window.fdc3 = DesktopAgentImpl` for webviews. For regular non-webview extensions (those running in the backend plugin process), we can make our DesktopAgent available via RPC calls or a custom VS Code extension API (maybe as part of the extension API in Theia).
    - **Testing this extension:** Use the ClientPickerWidget to test broadcasting contexts. Also prepare a second simple dummy extension app that calls `fdc3.addContextListener` and log or alert (via Theia's message/notifications service) when it receives something, to verify it works.
    - **Output:** The platform now has a working (even if basic) FDC3 DesktopAgent. Apps can call `fdc3.broadcast` and the messages are routed to the appropriate listeners in the same workspace. This is the core enabling technology of our platform.

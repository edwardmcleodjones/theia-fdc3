# Feature Specification: Theia FDC3 Workspace Platform

**Feature Branch**: `002-fdc3-workspace-spec`  
**Created**: 2025-10-21  
**Status**: Draft  
**Input**: User description derived from `prds/2-Spec.md` (Theia-Based FDC3 Workspace Platform)

## User Scenarios & Testing (mandatory)

### User Story 1 - Workspaces with isolated context (Priority: P1)

Users create and switch between multiple named workspaces; any context broadcast in one workspace affects only apps in that workspace.

- Why this priority: Prevents context bleed and enables parallel client/task handling, a core value prop.
- Independent Test: Open two workspaces with the same apps; broadcast a context in one and verify the other remains unchanged.

Acceptance Scenarios:

1. Given two open workspaces A and B with the same two apps, when a user selects Client X in workspace A, then only apps in workspace A update to Client X and workspace B remains at its prior context.
2. Given a workspace with three apps joined to the same channel, when any app broadcasts Instrument Y, then the other two apps in that workspace receive and display Instrument Y within the same workspace.

---

### User Story 2 - FDC3 context broadcast/listen (Priority: P1)

Apps in a workspace use the Desktop Agent to broadcast and listen for FDC3 standard contexts within that workspace’s channel.

- Why this priority: Enables interop without hard-coded integrations; foundational to value.
- Independent Test: Use a simple producer/consumer app pair to verify the consumer receives standard contexts in real time.

Acceptance Scenarios:

1. Given App A and App B are open in a workspace and joined to the workspace channel, when App A broadcasts a valid FDC3 Instrument context, then App B receives it and updates its view.
2. Given App B is not joined to the workspace channel, when App A broadcasts a context, then App B does not receive it.

---

### User Story 3 - Raise intents and resolve handlers (Priority: P1)

When an app raises an intent with context, the system resolves a handler: auto-routes if exactly one handler exists; otherwise shows an intent resolver for user selection.

- Why this priority: Enables cross-app workflows (e.g., ViewChart) and removes friction.
- Independent Test: Provide multiple handler apps for the same intent and confirm the chooser is presented and routes correctly.

Acceptance Scenarios:

1. Given only one installed app can handle ViewChart, when an app raises ViewChart with a valid Instrument context, then the handler app is focused and receives the context without prompting.
2. Given two installed apps can handle ViewChart, when an app raises ViewChart, then the user sees a chooser listing both apps with names and icons, and the chosen app opens/focuses with the provided context.

---

### User Story 4 - App discovery and launch (Priority: P2)

Users browse/search the App Store (extensions view) backed by a registry and launch installed apps into the current workspace.

- Why this priority: Lowers friction to extend capabilities; core to adoption.
- Independent Test: Install a sample app and launch it into a workspace from the App Store panel.

Acceptance Scenarios:

1. Given the App Store is open, when a user clicks Install for an app, then the app appears as available to launch without restarting the container.
2. Given an app is installed, when a user clicks Open from the App Store or a launcher, then the app appears as a new view/panel within the current workspace.

---

### User Story 5 - Notifications center with history (Priority: P2)

Apps can raise notifications; users can view a notifications center with history and filter for “All” vs “Current workspace”.

- Why this priority: Keeps users informed without juggling windows; aids auditability.
- Independent Test: Raise notifications from two workspaces and verify filtering works.

Acceptance Scenarios:

1. Given notifications exist from multiple workspaces, when a user selects “Current workspace” in the notifications center, then only notifications originating in the current workspace are shown.
2. Given a notification includes an action, when the user clicks the action, then the associated app is focused and the action-specific intent or callback executes.

---

### User Story 6 - Interop Log for troubleshooting (Priority: P2)

Users open an Interop Log view showing context broadcasts, intents raised/resolved, and notable errors, filterable by workspace, app, and event type.

- Why this priority: Critical for debugging and support in complex interop.
- Independent Test: Trigger a broadcast and an intent; verify both are logged with timestamps and details.

Acceptance Scenarios:

1. Given a workspace with two apps, when App A broadcasts context, then the log shows a time-stamped entry indicating source app, context type, and workspace.
2. Given an intent with two handlers, when the user selects a handler, then the log shows the resolver event and the chosen target.

---

### User Story 7 - Layout persistence (Priority: P3)

The platform restores previously open apps and panel layout for a workspace upon reopening the container.

- Why this priority: Saves time and preserves mental model across sessions.
- Independent Test: Arrange panels, close and reopen the platform, and confirm the layout is restored for the workspace.

Acceptance Scenarios:

1. Given a customized layout for Workspace A, when the platform restarts, then Workspace A reopens with the same apps and panel arrangement.
2. Given a user resets layout to default, when the platform restarts, then the default layout loads.

---

### Edge Cases

- Intent has no available handlers: show a clear message and optional link to App Store or documentation.
- Multiple handlers exist but all are closed/minimized: resolver still lists them with clear status; chosen handler opens/focuses.
- Non-standard/unknown context type broadcast: ignored by apps that don’t support it; no cross-workspace leakage.
- Offline or registry unreachable: App Store shows cached or bundled apps; core interop continues for installed apps.
- Browser vs. Electron: behavior consistent; no Node exposure to apps by default; webviews isolated.
- Performance pressure (many apps open): UI remains responsive and context propagation stays within target latency.

## Requirements (mandatory)

### Functional Requirements

- FR-001: Users MUST be able to create, rename, and switch between multiple workspaces presented as top-level tabs.
- FR-002: The system MUST scope interop to the active workspace such that broadcasts/intents do not affect other workspaces.
- FR-003: Apps MUST be able to join the workspace’s shared channel automatically when opened in that workspace.
- FR-004: The system MUST support broadcasting and listening for standard FDC3 context types within the workspace channel.
- FR-005: The system MUST support raising intents with context and routing to a single handler automatically when only one exists.
- FR-006: When multiple handlers exist, the system MUST present an intent resolver UI that lists candidate apps by name and icon and routes to the selected handler.
- FR-007: The system MUST bring the target handler app into focus and deliver the provided context.
- FR-008: Users MUST be able to discover, install, and uninstall apps through an App Store panel backed by a registry.
- FR-009: Users MUST be able to launch an installed app into the current workspace from the App Store or a launcher/dock.
- FR-010: The system MUST provide a notifications center that lists notifications with timestamps, levels (info/warn/error), and originating app.
- FR-011: The notifications center MUST provide filters for “All workspaces” and “Current workspace”.
- FR-012: Notifications MAY include actions; clicking an action MUST route focus to the originating app and perform the action (intent or callback).
- FR-013: The system MUST provide an Interop Log view that records context broadcasts, intents raised, intent resolutions, and notable errors, with filtering by workspace, app, and event type.
- FR-014: Workspace layout (open apps and panel arrangement) MUST persist across sessions for each workspace and be restorable on next launch.
- FR-015: Users MUST be able to reset a workspace layout to a default arrangement.
- FR-016: The platform MUST operate in modern browsers and as an Electron desktop app with consistent user-facing behavior.
- FR-017: The platform MUST sandbox web content (no Node access by default) and isolate webviews, validating message origins.
- FR-018: The system MUST avoid logging sensitive context payloads beyond what is necessary for debugging metadata unless the user explicitly opts in.
- FR-019: The platform MUST function without an external App Directory by relying on installed/bundled manifests and a registry; advanced directory integration is out of initial scope.
- FR-020: For MVP, channels MUST be equivalent to workspaces (one shared channel per workspace).

Constitution Alignment Checklist (ensure coverage):

- Business contexts and context selectors: workspaces represent contexts; selection propagates only within a workspace.
- FDC3 contracts: contexts (broadcast/listen), intents (raise/resolve), channels (workspace scope), Desktop Agent behaviors.
- Extension packaging boundaries: apps are packaged and installable; compatibility with VS Code extensions considered.
- Cross-platform expectations: browser and Electron parity; offline behavior for installed apps and cached listings.
- Test strategy, security, and observability: acceptance scenarios above; sandboxing and logging posture defined.

### Key Entities (data model)

- Workspace: name, id, channel id, layout state, open apps.
- App: id, name, icon, capabilities (intents/contexts), install status.
- Channel (workspace-scoped): id, members, last context.
- Context: type, payload.
- Intent: name, context type; Intent Resolution: chosen app, outcome.
- Notification: id, level, message, actions, origin, workspace id, timestamp.
- Interop Log Event: timestamp, type (broadcast/intent/resolve/error), workspace, app, details.

## Success Criteria (mandatory)

### Measurable Outcomes

- SC-001: Switching between workspaces completes in under 1 second in 95% of interactions.
- SC-002: Context broadcasts are received by joined apps within 300 ms in 95% of cases under typical load (≤ 5 apps in a workspace).
- SC-003: When multiple handlers exist, the intent resolver appears in under 2 seconds and routes to the selected app successfully 99% of the time.
- SC-004: 90% of users can install and launch an app from the App Store without assistance in under 2 minutes.
- SC-005: Notifications appear within 1 second of being raised and actions execute successfully 99% of the time.
- SC-006: 90% of users report no unintended context leakage across workspaces during UAT.
- SC-007: After restart, 95% of sessions restore the last saved layout for each workspace without user intervention.

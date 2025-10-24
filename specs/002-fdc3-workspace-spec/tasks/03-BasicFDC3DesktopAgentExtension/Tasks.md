# Tasks: Basic FDC3 DesktopAgent Extension

**Input**: Design documents from `/specs/002-fdc3-workspace-spec/`
**Prerequisites**: plan.md, spec.md, data-model.md
**Feature**: Basic FDC3 DesktopAgent Extension - Implement core FDC3 interoperability features

**Organization**: Tasks are organized to deliver a working FDC3 DesktopAgent that supports context broadcasting and listening within workspace-scoped channels.

**Tests**: Tests are NOT included in this task list as they were not explicitly requested in the specification.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

Project uses monorepo structure:

- Extensions: `theia-fdc3-extensions/theia-fdc3-extension/src/`
- Tests: `theia-fdc3-extensions/theia-fdc3-extension/tests/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure for FDC3 DesktopAgent extension

- [X] T001 Create FDC3 extension directory structure in theia-fdc3-extensions/theia-fdc3-extension/src/fdc3/
- [X] T002 Install @finos/fdc3 type definitions in theia-fdc3-extensions/theia-fdc3-extension/package.json
- [X] T003 [P] Configure TypeScript compilation for FDC3 module in theia-fdc3-extensions/theia-fdc3-extension/tsconfig.json
- [X] T004 [P] Setup Inversify dependency injection bindings file theia-fdc3-extensions/theia-fdc3-extension/src/fdc3/fdc3-di-module.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core FDC3 infrastructure that MUST be complete before user story implementation

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 Define DesktopAgent interface matching FDC3 spec in theia-fdc3-extensions/theia-fdc3-extension/src/fdc3/types/desktop-agent.interface.ts
- [X] T006 [P] Define Context type interfaces in theia-fdc3-extensions/theia-fdc3-extension/src/fdc3/types/context.interface.ts
- [X] T007 [P] Define Intent type interfaces in theia-fdc3-extensions/theia-fdc3-extension/src/fdc3/types/intent.interface.ts
- [X] T008 [P] Define Channel type interfaces in theia-fdc3-extensions/theia-fdc3-extension/src/fdc3/types/channel.interface.ts
- [X] T009 Create workspace context bus manager in theia-fdc3-extensions/theia-fdc3-extension/src/fdc3/services/workspace-context-bus.service.ts
- [X] T010 Implement event emitter infrastructure keyed by workspaceId in theia-fdc3-extensions/theia-fdc3-extension/src/fdc3/services/workspace-context-bus.service.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Workspaces with isolated context (Priority: P1) 🎯 MVP

**Goal**: Enable workspace-scoped context broadcasting so apps in one workspace don't affect apps in other workspaces

**Independent Test**: Open two workspaces with the same apps; broadcast a context in one and verify the other remains unchanged

### Implementation for User Story 1

- [X] T011 [P] [US1] Create Workspace entity model in theia-fdc3-extensions/theia-fdc3-extension/src/fdc3/models/workspace.model.ts
- [X] T012 [P] [US1] Create Channel entity model in theia-fdc3-extensions/theia-fdc3-extension/src/fdc3/models/channel.model.ts
- [X] T013 [US1] Implement workspace-to-channel mapping service in theia-fdc3-extensions/theia-fdc3-extension/src/fdc3/services/workspace-channel-mapper.service.ts
- [X] T014 [US1] Add workspace isolation logic to context bus manager in theia-fdc3-extensions/theia-fdc3-extension/src/fdc3/services/workspace-context-bus.service.ts
- [X] T015 [US1] Implement channel member tracking per workspace in theia-fdc3-extensions/theia-fdc3-extension/src/fdc3/services/workspace-context-bus.service.ts
- [X] T016 [US1] Add validation to ensure broadcasts only propagate within workspace boundaries in theia-fdc3-extensions/theia-fdc3-extension/src/fdc3/services/workspace-context-bus.service.ts

**Checkpoint**: At this point, workspace isolation should be functional - broadcasts in one workspace don't affect others

---

## Phase 4: User Story 2 - FDC3 context broadcast/listen (Priority: P1)

**Goal**: Enable apps to broadcast and listen for FDC3 standard contexts within their workspace channel

**Independent Test**: Use a simple producer/consumer app pair to verify the consumer receives standard contexts in real time

### Implementation for User Story 2

- [X] T017 [P] [US2] Create DesktopAgentImpl class skeleton with stub methods in theia-fdc3-extensions/theia-fdc3-extension/src/fdc3/services/desktop-agent.service.ts
- [X] T018 [US2] Implement broadcast(context) method to publish to workspace context bus in theia-fdc3-extensions/theia-fdc3-extension/src/fdc3/services/desktop-agent.service.ts
- [X] T019 [US2] Implement addContextListener(contextType, handler) method in theia-fdc3-extensions/theia-fdc3-extension/src/fdc3/services/desktop-agent.service.ts
- [X] T020 [US2] Add context type filtering logic to listener registration in theia-fdc3-extensions/theia-fdc3-extension/src/fdc3/services/desktop-agent.service.ts
- [X] T021 [US2] Implement listener cleanup and unsubscribe logic in theia-fdc3-extensions/theia-fdc3-extension/src/fdc3/services/desktop-agent.service.ts
- [X] T022 [US2] Add current workspace detection to route broadcasts correctly in theia-fdc3-extensions/theia-fdc3-extension/src/fdc3/services/desktop-agent.service.ts
- [X] T023 [US2] Implement context validation against FDC3 context type schema in theia-fdc3-extensions/theia-fdc3-extension/src/fdc3/services/context-validator.service.ts

**Checkpoint**: At this point, apps should be able to broadcast and listen for contexts within their workspace

---

## Phase 5: User Story 3 - Raise intents and resolve handlers (Priority: P1)

**Goal**: Enable apps to raise intents with context and auto-route when one handler exists (resolver UI deferred to later task)

**Independent Test**: Provide one handler app for an intent and confirm it auto-routes correctly

### Implementation for User Story 3

- [X] T024 [P] [US3] Create Intent entity model in theia-fdc3-extensions/theia-fdc3-extension/src/fdc3/models/intent.model.ts
- [X] T025 [P] [US3] Create IntentResolution entity model in theia-fdc3-extensions/theia-fdc3-extension/src/fdc3/models/intent-resolution.model.ts
- [X] T026 [US3] Create intent registry service in theia-fdc3-extensions/theia-fdc3-extension/src/fdc3/services/intent-registry.service.ts
- [X] T027 [US3] Implement addIntentListener(intent, handler) method in theia-fdc3-extensions/theia-fdc3-extension/src/fdc3/services/desktop-agent.service.ts
- [X] T028 [US3] Implement raiseIntent(intent, context, target) method with handler lookup in theia-fdc3-extensions/theia-fdc3-extension/src/fdc3/services/desktop-agent.service.ts
- [X] T029 [US3] Add auto-routing logic for single handler case in theia-fdc3-extensions/theia-fdc3-extension/src/fdc3/services/desktop-agent.service.ts
- [X] T030 [US3] Add placeholder for multiple handler resolution (to be implemented in resolver task) in theia-fdc3-extensions/theia-fdc3-extension/src/fdc3/services/desktop-agent.service.ts
- [X] T031 [US3] Implement findIntent(intent) method to query available handlers in theia-fdc3-extensions/theia-fdc3-extension/src/fdc3/services/desktop-agent.service.ts
- [X] T032 [US3] Implement findIntentsByContext(context) method in theia-fdc3-extensions/theia-fdc3-extension/src/fdc3/services/desktop-agent.service.ts

**Checkpoint**: At this point, intents should route to single handlers automatically

---

## Phase 6: FDC3 API Exposure & Integration

**Purpose**: Expose the FDC3 DesktopAgent API to apps running in the platform

- [X] T033 [P] Create frontend FDC3 API proxy for browser environment in theia-fdc3-extensions/theia-fdc3-extension/src/browser/fdc3-frontend-proxy.ts
- [X] T034 [P] Create backend FDC3 API service interface in theia-fdc3-extensions/theia-fdc3-extension/src/common/fdc3-protocol.ts
- [X] T035 Implement RPC communication between frontend and backend for FDC3 calls in theia-fdc3-extensions/theia-fdc3-extension/src/browser/fdc3-frontend-proxy.ts
- [X] T036 Inject window.fdc3 object in Electron webviews in theia-fdc3-extensions/theia-fdc3-extension/src/electron-browser/fdc3-preload.ts
- [X] T037 Create Theia frontend module binding FDC3 services in theia-fdc3-extensions/theia-fdc3-extension/src/browser/fdc3-frontend-module.ts
- [X] T038 Create Theia backend module binding FDC3 services in theia-fdc3-extensions/theia-fdc3-extension/src/node/fdc3-backend-module.ts
- [X] T039 Implement getOrCreateChannel(channelId) method with workspace mapping in theia-fdc3-extensions/theia-fdc3-extension/src/fdc3/services/desktop-agent.service.ts
- [X] T040 Add message origin validation for webview communications in theia-fdc3-extensions/theia-fdc3-extension/src/browser/fdc3-frontend-proxy.ts

**Checkpoint**: At this point, apps can access window.fdc3 or call FDC3 APIs through extension mechanisms

---

## Phase 7: Testing & Validation

**Purpose**: Create test apps and validate the FDC3 DesktopAgent works correctly

- [X] T041 Create simple test producer extension that broadcasts contexts in theia-fdc3-extensions/fdc3-test-producer/src/extension.ts
- [X] T042 Create simple test consumer extension that listens for contexts in theia-fdc3-extensions/fdc3-test-consumer/src/extension.ts
- [X] T043 Integrate test consumer with Theia notifications to display received contexts in theia-fdc3-extensions/fdc3-test-consumer/src/extension.ts
- [X] T044 Update ClientPickerWidget to broadcast FDC3 client context on selection in theia-fdc3-extensions/client-picker-widget/src/browser/client-picker-widget.tsx
- [X] T045 Test workspace isolation with two workspaces and verify no cross-workspace context leakage
- [X] T046 Test context type filtering with specific and wildcard listeners
- [X] T047 Test intent routing with single handler auto-resolution

**Checkpoint**: All core FDC3 broadcast/listen/intent functionality validated

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements affecting the FDC3 implementation

- [X] T048 [P] Add comprehensive JSDoc comments to FDC3 API surface in theia-fdc3-extensions/theia-fdc3-extension/src/fdc3/types/
- [X] T049 [P] Add error handling and user-friendly error messages for FDC3 operations in theia-fdc3-extensions/theia-fdc3-extension/src/fdc3/services/desktop-agent.service.ts
- [X] T050 [P] Implement logging for FDC3 operations (broadcast, listen, intent) in theia-fdc3-extensions/theia-fdc3-extension/src/fdc3/services/fdc3-logger.service.ts
- [X] T051 Add privacy-conscious logging filters to avoid logging sensitive context payloads in theia-fdc3-extensions/theia-fdc3-extension/src/fdc3/services/fdc3-logger.service.ts
- [X] T052 Update theia-fdc3-extension README with FDC3 usage documentation in theia-fdc3-extensions/theia-fdc3-extension/README.md
- [X] T053 Add FDC3 API examples to documentation in docs/fdc3-api-guide.md
- [X] T054 Code review and refactoring for consistency with Theia patterns

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational phase completion
- **User Story 2 (Phase 4)**: Depends on User Story 1 completion (needs workspace isolation)
- **User Story 3 (Phase 5)**: Depends on User Story 2 completion (needs broadcast/listen working)
- **FDC3 API Exposure (Phase 6)**: Depends on User Stories 1-3 completion
- **Testing & Validation (Phase 7)**: Depends on Phase 6 completion
- **Polish (Phase 8)**: Depends on all core implementation being complete

### Critical Path

```
Setup → Foundational → US1 (isolation) → US2 (broadcast/listen) → US3 (intents) → API Exposure → Testing → Polish
```

### User Story Dependencies

- **User Story 1 (Workspace Isolation)**: Foundation for all FDC3 operations - MUST be first
- **User Story 2 (Broadcast/Listen)**: Requires US1 workspace isolation to be complete
- **User Story 3 (Intents)**: Requires US2 broadcast/listen infrastructure to be working

### Within Each User Story

**User Story 1**:

- Models (T011, T012) can run in parallel
- Services depend on models being complete
- Validation depends on all services being implemented

**User Story 2**:

- DesktopAgentImpl skeleton (T017) must be first
- broadcast and addContextListener can be implemented sequentially
- Context validator (T023) can run in parallel with listener implementation

**User Story 3**:

- Models (T024, T025) can run in parallel
- Intent registry before raiseIntent implementation
- findIntent methods can run in parallel with raiseIntent

**Phase 6**:

- Frontend proxy (T033) and backend protocol (T034) can run in parallel
- RPC communication depends on both proxy and protocol
- Module bindings depend on RPC being complete

### Parallel Opportunities

```bash
# Setup phase - all parallelizable:
T003 (TypeScript config) || T004 (DI bindings)

# Foundational phase - types can run in parallel:
T006 (Context types) || T007 (Intent types) || T008 (Channel types)

# User Story 1 - models in parallel:
T011 (Workspace model) || T012 (Channel model)

# User Story 3 - models in parallel:
T024 (Intent model) || T025 (IntentResolution model)

# API Exposure - frontend and backend in parallel:
T033 (Frontend proxy) || T034 (Backend protocol)

# Polish phase - documentation in parallel:
T048 (JSDoc) || T049 (Error handling) || T050 (Logging)
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Workspace Isolation)
4. Complete Phase 4: User Story 2 (Broadcast/Listen)
5. Complete Phase 6: API Exposure (partial - enough to test)
6. Complete Phase 7: Testing & Validation (partial - test broadcast/listen only)
7. **STOP and VALIDATE**: Test broadcast/listen with workspace isolation
8. Deploy/demo if ready

This MVP delivers the core value proposition stated in the task specification:

> "The platform now has a working (even if basic) FDC3 DesktopAgent. Apps can call `fdc3.broadcast` and the messages are routed to the appropriate listeners in the same workspace."

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (Isolation) → Test independently
3. Add User Story 2 (Broadcast/Listen) → Test independently → **Deploy/Demo (MVP!)**
4. Add User Story 3 (Intents) → Test independently → Deploy/Demo
5. Add API Exposure → Test with real apps
6. Add Testing & Validation → Full validation
7. Add Polish → Production ready

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Sequential implementation required due to dependencies:
   - Developer A: User Story 1 (Isolation)
   - Wait for US1 completion
   - Developer A: User Story 2 (Broadcast/Listen)
   - Developer B: User Story 3 (Intents) - can start after US2
   - Developer C: Testing apps (T041-T043) - can start after US2
3. Parallel work on Phase 6 (API Exposure) after US3 complete
4. Parallel work on Phase 8 (Polish) after validation

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story builds on previous ones (workspace isolation → broadcast/listen → intents)
- Stop at MVP checkpoint (after US2) to validate core value before proceeding
- Commit after each task or logical group
- Testing tasks (Phase 7) validate the entire implementation
- Focus is on broadcast/listen as stated in task specification: "The main methods we're initially interested in are around broadcasts only"

---

## Constitution Alignment

This implementation aligns with the constitution requirements:

- **Theia-Conformant Foundation**: All functionality delivered as Theia extensions with proper DI bindings
- **Context-First Workflow Model**: Workspaces represent business contexts; Desktop Agent scopes messages per workspace
- **FDC3-First Interoperability**: Implements broadcast/listen/intents per FDC3 specification
- **Modular Extension Architecture**: Clear extension boundary for FDC3 Desktop Agent with activation conditions
- **VS Code Extension Compatibility**: FDC3 API exposed through extension mechanisms compatible with VS Code extensions
- **Workspace UX & Productivity**: Context routing respects workspace boundaries
- **Enterprise Quality & Security**: Message origin validation, privacy-conscious logging, workspace isolation
- **Cross-Platform & Hybrid Delivery**: RPC-based architecture works in both browser and Electron

---

## Success Metrics

After completion, the following should be true:

- ✅ Apps can call `fdc3.broadcast(context)` and listeners in the same workspace receive it
- ✅ Apps can call `fdc3.addContextListener(handler)` to receive contexts
- ✅ Context type filtering works correctly (specific type and wildcard listeners)
- ✅ Broadcasts in one workspace do NOT affect apps in other workspaces
- ✅ Single-handler intents auto-route without user interaction
- ✅ `window.fdc3` object is available in Electron webviews
- ✅ FDC3 API is accessible to backend extensions via RPC
- ✅ Test apps can demonstrate broadcast/listen and intent functionality
- ✅ No sensitive context data appears in logs by default

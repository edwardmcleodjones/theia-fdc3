---
description: "Tasks for Client Picker Extension (context provider widget)"
---

# Tasks: Client Picker Extension

Input: specs/002-fdc3-workspace-spec (plan.md, spec.md, data-model.md, research.md)

Scope: JUST the Client Picker context provider described in `prds/01-ClientPickerExtension/Tasks.md` — a left-panel widget listing clients that broadcasts an FDC3 context on selection.

Constitution alignment: Delivered as a Theia extension (frontend widget), uses @finos/fdc3 types, no Node leakage, browser/Electron compatible via existing product apps.

Notes: Tests are optional and not requested here; we focus on implementation tasks that are independently verifiable.

## Phase 1: Setup (Shared Infrastructure)

Purpose: Create the new extension package and wire it into the monorepo/apps.

- [x] T001 [P] Scaffold extension package at `theia-fdc3-extensions/client-picker-widget/` (create `package.json`, `tsconfig.json`, `src/browser/`)
- [x] T002 [P] Add runtime deps in `theia-fdc3-extensions/client-picker-widget/package.json` (e.g., `@theia/core`, `inversify`, `react`, `@finos/fdc3`)
- [x] T003 [P] Add build scripts in `theia-fdc3-extensions/client-picker-widget/package.json` (clean/build/watch with `tsc`)
- [x] T004 [P] Add dependency to include the extension in Browser app: edit `applications/browser/package.json` → `dependencies.client-picker-widget: "0.0.0"`
- [x] T005 [P] Add dependency to include the extension in Electron app: edit `applications/electron/package.json` → `dependencies.client-picker-widget: "0.0.0"`

---

## Phase 2: Foundational (Blocking Prerequisites)

Purpose: Minimal wiring so the widget can be contributed to the left area and built by apps.

- [x] T006 Define Theia extension entry in `theia-fdc3-extensions/client-picker-widget/package.json` → `theiaExtensions.frontend: "lib/browser/client-picker-frontend-module"`
- [x] T007 [P] Create frontend module at `theia-fdc3-extensions/client-picker-widget/src/browser/client-picker-frontend-module.ts` (bind widget + contribution, placeholder only)
- [ ] T008 [P] Create React widget scaffold at `theia-fdc3-extensions/client-picker-widget/src/browser/ClientPickerWidget.tsx` (placeholder list UI, no behavior yet)
- [ ] T009 [P] Add styles at `theia-fdc3-extensions/client-picker-widget/src/browser/style/client-picker.css` and import into widget/module

Checkpoint: Extension loads as an empty left-panel view in both Browser and Electron apps.

---

## Phase 3: User Story 2 - FDC3 context broadcast/listen (Priority: P1) 🎯 MVP

Goal: Provide a left-panel Client Picker; selecting a client broadcasts an FDC3 context like `{ type: 'fdc3.client', name, id: { clientId } }` within the current workspace.

Independent Test: When `window.fdc3` is available, select a client and verify `fdc3.broadcast` is called with the correct payload (via devtools log or future Interop Log). If `fdc3` is unavailable, verify graceful fallback logging in the widget (no crash).

### Implementation for User Story 2

- [ ] T010 [P] [US2] Add client list data source at `theia-fdc3-extensions/client-picker-widget/src/browser/clients.ts` (hardcoded 8–10 well-known clients)
- [ ] T011 [US2] Implement selection handling in `src/browser/ClientPickerWidget.tsx` → call `window.fdc3?.broadcast({ type: 'fdc3.client', name, id: { clientId } })`
- [ ] T012 [P] [US2] Add WidgetContribution at `theia-fdc3-extensions/client-picker-widget/src/browser/ClientPickerContribution.ts` (register left area view, command `clientPicker:open`)
- [ ] T013 [US2] Add null-guard + fallback logging in `ClientPickerWidget.tsx` (use Theia OutputChannel if available; otherwise `console.warn`) when FDC3 API missing
- [ ] T014 [US2] Add icon asset `theia-fdc3-extensions/client-picker-widget/resources/icon.svg` and wire label/icon in contribution
- [ ] T015 [US2] Add README with payload shape and usage at `theia-fdc3-extensions/client-picker-widget/README.md`

Checkpoint: Selecting an entry in the Client Picker triggers an FDC3 client context broadcast (or logs a clear message if FDC3 is not available yet).

---

## Phase N: Polish & Cross-Cutting Concerns

Purpose: Improve quality and maintainability.

- [ ] T016 [P] Add basic project docs and license headers in `theia-fdc3-extensions/client-picker-widget/README.md` and sources
- [ ] T017 [P] Align tsconfig/lint with repo standards in `theia-fdc3-extensions/client-picker-widget/tsconfig.json` (match `configs/base.tsconfig.json` where applicable)
- [ ] T018 Verify Browser/Electron startup shows the Client Picker view; capture notes in `README.md` (manual check only for now)

---

## Dependencies & Execution Order

Phase dependencies:

- Setup → Foundational → US2 → Polish

User story dependencies:

- US2 depends on Foundational completion; independently verifiable via devtools logs until Interop Log exists.

Within US2:

- Parallel: T010, T012 can proceed in parallel; T011 depends on T008; T013–T015 depend on T011/T012 context being in place.

---

## Parallel Execution Example (US2)

- In parallel: implement data source (T010) and contribution wiring (T012)
- Then: implement selection/broadcast handling (T011)
- Then: add fallback logging + icon + docs (T013–T015)

---

## Implementation Strategy

MVP first (this feature is the MVP producer):

1. Complete Setup + Foundational so the view renders
2. Implement US2 behavior (selection → broadcast)
3. Validate manually via devtools and README steps

Incremental delivery:

- Later, pair with a simple consumer/viewer or Interop Log to observe broadcasts (out of scope here)

---

## Report

Output path: `prds/01-ClientPickerExtension/Tasks.md`

Summary:

- Total tasks: 18
- Tasks per user story: US2 → 6
- Parallel opportunities: T001–T005 (setup), T007–T009 (foundational), T010 & T012 (US2), T016–T017 (polish)
- Independent test criteria: For US2, selection triggers `fdc3.broadcast` with correct payload (or fallback log if API unavailable)
- Suggested MVP scope: Phase 1–3 (through US2)
- Format validation: All tasks follow `- [ ] T### [P?] [US?] Description with file path`

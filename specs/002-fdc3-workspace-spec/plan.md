# Implementation Plan: Theia FDC3 Workspace Platform

**Branch**: `002-fdc3-workspace-spec` | **Date**: 2025-10-21 | **Spec**: specs/002-fdc3-workspace-spec/spec.md
**Input**: Feature specification from `/specs/002-fdc3-workspace-spec/spec.md`

## Summary

Deliver a Theia-based financial desktop container that hosts multiple “apps” side-by-side, isolates context by workspace, and provides FDC3 interoperability (contexts, intents, channels). Users can discover and launch apps from an App Store (Open VSX-backed), receive and filter notifications, inspect an Interop Log, and have workspace layouts persist across sessions. Implementation is via modular Theia extensions: Workspace Manager (workspace tabs and layout), Desktop Agent (FDC3 API + resolver), App Store/Launcher, Notifications/Logging, and AI Assistant panel. Browser and Electron targets ship from one codebase with sandboxed webviews and privacy-conscious logging.

## Technical Context

**Language/Version**: TypeScript (ES2020+)
**Primary Dependencies**: Eclipse Theia platform (frontend/backend), Electron (desktop target), React (widgets), Inversify (DI), @finos/fdc3 (types), Theia Extension Manager (App Store base)
**Storage**: Theia Preferences + browser localStorage for per-user state (layouts, recent workspaces); optional text OutputChannels for logs
**Testing**: Jest/Mocha unit tests for Desktop Agent logic and services; Theia integration tests; manual UAT for resolver UX; FDC3 conformance suite during CI
**Target Platform**: Electron (Windows first) and modern Chromium-based browsers
**Project Type**: Web application delivered as Theia extensions (monorepo), dual target (browser + Electron)
**Performance Goals**: Workspace switch < 1s p95; broadcast delivery < 300ms p95 within typical load (≤ 5 apps); resolver display < 2s; layout restore reliability ≥ 95%
**Constraints**: Sandboxed webviews (no Node by default), message origin validation, minimal sensitive data in logs, offline-capable for installed apps and cached listings
**Scale/Scope**: 5–10 apps per workspace, 1–3 active workspaces; extension catalog curated via Open VSX-compatible registry

## Constitution Check

All gates PASS based on this plan:

- Theia-Conformant Foundation: All functionality delivered as Theia extensions and contribution filters; no core forks proposed.
- Context-First Workflow Model: Workspaces represent business contexts; Desktop Agent scopes messages per workspace channel; context selectors/joins documented.
- FDC3-First Interoperability: Supports broadcast/listen, intents with resolver, and workspace-scoped channels; schedule to run FDC3 conformance tests in CI.
- Modular Extension Architecture: Clear extension boundaries (Workspace Manager, Desktop Agent, App Store/Launcher, Notifications/Logging, AI Assistant) with activation conditions and versioned cross-extension contracts.
- VS Code Extension Compatibility: Uses Open VSX-compatible flow; app manifests audited; sandboxing preserved for VSIX webviews.
- Workspace UX & Productivity: IDE widgets (file explorer/editor) remain hidden; launcher and workspace tabs emphasized; intent resolver and notifications integrated.
- Enterprise Quality & Security: Unit/integration tests, threat modeling for message routing, origin checks, least-privilege sandbox, privacy-conscious logging.
- Cross-Platform & Hybrid Delivery: Parity targets for Electron and browser; offline behavior defined for installed apps and cached store entries.

## Project Structure

### Documentation (this feature)

```
specs/002-fdc3-workspace-spec/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
└── contracts/
    └── openapi.yaml
```

### Source Code (repository root)

```
theia-fdc3-extensions/
└── theia-fdc3-extension/          # Base product assembly (keeps IDE widgets hidden; wires custom extensions)

theia-extensions/
├── launcher/                      # App launcher/dock contributions (to be extended for workspace apps)
├── product/                       # Product packaging/build wiring
└── updater/                       # Updater related

applications/
├── browser/                       # Browser build configuration
└── electron/                      # Electron build configuration

plugins/                           # Bundled VSIX plugins (e.g., simple-browser, themes) – curated catalog
```

**Structure Decision**: Build and ship new capabilities as Theia extensions under existing extension packages (`theia-extensions/*`) and the base product assembly (`theia-fdc3-extensions/theia-fdc3-extension`). No new top-level projects required; CI/build scripts updated to include new extensions and configs for both browser and Electron.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| None      | —          | —                                    |

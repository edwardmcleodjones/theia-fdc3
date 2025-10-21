# Quickstart: Theia FDC3 Workspace Platform (Planning Preview)

This document outlines how this feature set will run once implemented. It’s a planning aid and may evolve during development.

## Prerequisites

- Node.js LTS
- Yarn (workspace support)
- Git
- Windows for Electron target (browser target works on any OS)

## Run (Browser target)

```powershell
# From repo root
yarn install
# Start Theia backend and open browser frontend
yarn start
```

## Run (Electron target)

```powershell
# From repo root
yarn install
# Build Electron app per product packaging
yarn electron build
# Launch dev Electron (if configured)
yarn electron start
```

## Feature toggles and config

- App Store registry URL: configurable via environment or product settings.
- AI Assistant: optional; can be disabled per deployment.

## What to expect (MVP)

- Multiple workspaces (tabs) with isolated context
- FDC3 Desktop Agent available to apps; workspace-scoped broadcasts and intents
- Intent resolver UI when multiple handlers exist
- App Store panel to install/launch apps
- Notifications center with filter for current workspace vs all
- Interop Log view
- Layout persistence across sessions

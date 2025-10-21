# Research & Decisions: Theia FDC3 Workspace Platform

Date: 2025-10-21  
Branch: 002-fdc3-workspace-spec  
Source: specs/002-fdc3-workspace-spec/spec.md

## Decisions

### 1) Channels vs Workspaces

- Decision: One shared channel per workspace (channels == workspaces) for MVP.
- Rationale: Simplifies scoping and matches spec’s initial assumption; reduces UI complexity.
- Alternatives considered: Multiple channels per workspace (rejected for MVP to avoid UX and routing complexity); global default channel (rejected to prevent context bleed).

### 2) App Store backend

- Decision: Use Open VSX-compatible registry or static JSON for MVP; allow configuration via environment/settings.
- Rationale: Leverages existing Theia Extension Manager flows and avoids building a separate App Directory service initially.
- Alternatives: Build full FDC3 App Directory integration now (rejected for scope); use public Open VSX in dev only (kept as fallback).

### 3) Notifications Center filtering

- Decision: Provide two filters: “All workspaces” and “Current workspace”.
- Rationale: Aligns with spec and keeps control simple; expands later if needed.
- Alternatives: Per-app filters (added as a log filter, not required for MVP in notifications).

### 4) Interop Log scope

- Decision: Log context broadcasts, intents raised/resolved, and notable errors; filter by workspace, app, and event type.
- Rationale: Satisfies developer troubleshooting and support needs with minimal noise.
- Alternatives: Full payload logging (rejected for privacy); sampling-based logging (not needed yet).

### 5) Layout persistence mechanism

- Decision: Use Theia Preferences/localStorage to persist per-workspace layout and open apps.
- Rationale: Minimal infrastructure, consistent with Theia capabilities.
- Alternatives: External DB or file store (overkill for MVP; can add later for roaming profiles).

### 6) Browser/Electron parity

- Decision: Single codebase; Electron preload (when needed) for window.fdc3 compatibility; browser uses getAgent() Web Connection.
- Rationale: Meets cross-platform gate with a predictable path; mirrors industry practice.
- Alternatives: Separate code paths (rejected to avoid divergence).

## Best Practices / Patterns

- Theia extension boundaries: UI widgets in frontend modules; stateful services in backend modules; DI via Inversify; avoid leaking Node APIs to webviews.
- FDC3 conformance: run FINOS tests as part of CI; document Desktop Agent getInfo/metadata; validate message origins for web connections.
- Security: content-security-policy for iframes/webviews; no Node by default; explicit permissions audit for VSIX.
- Performance: throttle or debounce high-frequency broadcasts; lazy-load heavy widgets; avoid logging sensitive payloads.

## Open Questions (resolved)

- Do we require multi-channel per workspace in MVP? No; defer.
- Do we need full App Directory (FDC3) now? No; use registry/static JSON for MVP.
- Should layout restore be per-workspace or global? Per-workspace; default layout reset available.

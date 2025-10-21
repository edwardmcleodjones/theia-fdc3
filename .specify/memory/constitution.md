<!--
Sync Impact Report:
- Version change: 0.0.0 → 1.0.0 (initial adoption)
- Modified principles: n/a (initial publication)
- Added sections: Core Principles; Platform Delivery Standards; Operational Discipline & Workflow; Governance
- Removed sections: None
- Templates requiring updates: ✅ .specify/templates/plan-template.md (Constitution Check gates aligned)
- Follow-up TODOs: None
-->

# Theia-Based FDC3 Workspace Platform Constitution

## Core Principles

### I. Theia-Conformant Foundation
The platform extends the Eclipse Theia distribution while preserving upstream compatibility.
- We MUST deliver customizations as plugins, extensions, or contribution filters; any core fork requires architecture sign-off, a regression plan, and a documented path to upstream.
- We MUST validate upgrade readiness against the latest supported Theia release within one release cycle and surface blockers in the maintenance backlog.
Rationale: Preserving Theia alignment keeps upgrades predictable and ensures continued access to the upstream ecosystem.

### II. Context-First Workflow Model
Workspace behavior is anchored to business context (client, case, portfolio) rather than individual files.
- Every feature MUST declare its context dependencies and react to context changes emitted by the desktop agent.
- New UI surfaces MUST present context selectors when multiple contexts are available and MUST avoid file-centric affordances unless indispensable.
Rationale: Context-driven navigation mirrors user workflows and prevents regressions toward document-centric UX.

### III. FDC3-First Interoperability
The platform implements and enforces FINOS FDC3 standards for all inter-app communications.
- The bundled Desktop Agent MUST mediate intent, context, and channel lifecycles, and we MUST only expose messages to authorized workspace members.
- All apps MUST register FDC3 capabilities in manifests and ship automated conformance checks for supported intents and contexts.
Rationale: Reliable FDC3 interoperability unlocks plug-and-play integration across internal and third-party applications.

### IV. Modular Extension Architecture
Capabilities are packaged as discrete Theia extensions for composition and selective enablement.
- Each feature MUST ship as an independently versioned extension with clear activation conditions and documented dependencies.
- Extensions MUST encapsulate UI, services, and storage bindings; cross-extension contracts require versioned APIs and tests.
Rationale: Modular delivery supports targeted deployments, third-party contributions, and safe feature toggling.

### V. Workspace UX & Productivity
The interface behaves like a focused workspace launcher, not a general-purpose IDE.
- Default Theia widgets (file explorer, text editor) MUST remain hidden unless a feature explicitly opts in through review.
- The shell MUST provide app launchers, workspace tabs, notifications, and context awareness consistent with modern financial desktops.
Rationale: Purpose-built UX shortens onboarding time and keeps user attention on coordinated workflows.

### VI. VS Code Extension Compatibility
We maintain broad compatibility with VS Code extensions sourced from Open VSX.
- Runtime MUST support installing signed VSIX packages when they align with our context model; any incompatibility MUST be documented with remediation steps or blockers.
- Extension sandboxing MUST remain intact, with permissions audited before promotion to production catalogs.
Rationale: Compatibility expands available functionality without bespoke development.

### VII. Enterprise Quality & Security
Quality, security, and maintainability guardrails are non-negotiable.
- Every extension MUST include automated tests (unit plus integration or contract as appropriate), linting, and threat modeling aligned with our review checklist.
- We MUST isolate untrusted webviews, enforce least-privilege data access, and plan for enterprise needs (SSO, RBAC, auditing) so future adoption is frictionless.
Rationale: Enterprise readiness preserves trust with clients and accelerates compliance approvals.

### VIII. Cross-Platform & Hybrid Delivery
The solution ships for Electron desktop and browser-hosted deployments with parity.
- Electron and browser builds MUST share a single codebase; divergence requires explicit governance approval and a reunification plan.
- We MUST support connected and offline execution modes, defining service fallbacks and caching policies for each user-critical workflow.
Rationale: Cross-platform availability meets varied deployment environments without multiplying maintenance overhead.

## Platform Delivery Standards

- Maintain a shared release pipeline that produces signed Electron installers and containerized browser deployments from the same build graph.
- Provide automated smoke suites for each target environment (Windows, macOS, Linux, modern browsers) and block release promotion on failures.
- Curate an approved extension catalog that records FDC3 intents, context contracts, and security posture for each add-on.
- Record architecture decisions (ADRs) whenever platform scope or context routing changes, linking to impacted extensions and specs.

## Operational Discipline & Workflow

- Product discovery MUST document user contexts and target workflows before implementation planning.
- Feature plans MUST include FDC3 contract updates, context lifecycle impacts, and UX adjustments in the Constitution Check gate.
- Every pull request MUST link to validation evidence (tests, manual verification) for desktop and web targets.
- Quarterly reviews MUST assess context orchestration performance, security posture, and alignment with Theia/FDC3 roadmaps.

## Governance

- This constitution supersedes conflicting process documents; exceptions require maintainer council approval and an expiry date.
- Amendments require a written proposal, consensus from two maintainers and one product representative, and an impact review on extension catalog, templates, and user guidance.
- Versioning follows semantic rules: MAJOR for principle changes that remove or redefine obligations, MINOR for new or expanded sections, PATCH for clarifications.
- Each release cycle MUST include a compliance audit covering Constitution Check gates, FDC3 conformance tests, and platform security posture; findings feed into the maintenance backlog.

**Version**: 1.0.0 | **Ratified**: 2025-10-21 | **Last Amended**: 2025-10-21

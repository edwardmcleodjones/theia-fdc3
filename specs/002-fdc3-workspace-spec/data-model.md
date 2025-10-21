# Data Model: Theia FDC3 Workspace Platform

Date: 2025-10-21

## Entities

### Workspace

- id: string
- name: string
- channelId: string (maps 1:1 to workspace)
- layoutState: object (opaque layout JSON)
- openApps: AppInstance[]

### App

- id: string (extension id)
- name: string
- icon: URI
- capabilities:
  - intents: string[]
  - contexts: string[]
- installStatus: enum { installed, available }

### AppInstance

- instanceId: string
- appId: string
- workspaceId: string
- joinedChannelId: string
- state: object (app-specific UI state, optional)

### Channel

- id: string
- name: string
- members: string[] (AppInstance.instanceId)
- lastContext?: Context

### Context

- type: string (e.g., fdc3.instrument)
- payload: object

### Intent

- name: string (e.g., ViewChart)
- contextType?: string

### IntentResolution

- intent: string
- chosenAppId: string
- outcome: string (e.g., delivered, failed)
- timestamp: ISO datetime

### Notification

- id: string
- level: enum { info, warn, error }
- message: string
- actions?: Array<{ id: string; title: string; intent?: string; }>
- originAppId: string
- workspaceId?: string
- timestamp: ISO datetime

### InteropLogEvent

- id: string
- timestamp: ISO datetime
- type: enum { broadcast, intent, resolve, error }
- workspaceId: string
- appId?: string
- details: object

## Relationships

- Workspace 1..1 → Channel (MVP)
- Workspace 1..\* → AppInstance
- App 1..\* → AppInstance
- Channel 1..\* → AppInstance (members)
- IntentResolution 1..1 → Intent

## Validation Rules

- Context.type MUST be a valid FDC3 context type for broadcast listener delivery.
- Intent.name MUST be registered by at least one installed app or resolver prompts user.
- Notification.level MUST be one of info/warn/error.
- AppInstance.joinedChannelId MUST equal its Workspace.channelId (MVP).

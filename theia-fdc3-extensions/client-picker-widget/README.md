# Client Picker Widget

A Theia frontend extension that provides a left-side "Client Picker" widget.  
Selecting a client broadcasts an FDC3 context for the active workspace so other workspace-aware apps can react.

## Features

- Lists a curated set of 10 well-known clients with segment, location, and notes.
- Broadcasting uses the workspace Desktop Agent via `fdc3.broadcast`.
- Graceful fallback logging via Theia Output channel (or `console.warn`) when FDC3 is unavailable.
- Command palette entry `clientPicker:open` (View → Client Picker) registered by the widget contribution.

## Broadcast Payload

When you click **Broadcast Context** the widget emits the following payload:

```json
{
  "type": "fdc3.client",
  "name": "Acme Capital",
  "id": {
    "clientId": "cl-ace-001"
  }
}
```

- `type`: always `fdc3.client`
- `name`: client display name
- `id.clientId`: stable identifier for downstream services

## Manual Verification

1. Launch the Theia FDC3 workspace application (browser or Electron).
2. Open the widget with `Ctrl/Cmd + Shift + P` → `Client Picker: Open` or via *View → Client Picker*.
3. With FDC3 available (e.g., Desktop Agent running), click **Broadcast Context** for a client.
   - Expect `fdc3.broadcast` to fire – confirm via devtools logging or receiving app.
4. If FDC3 is not present, the widget writes a warning to the *Client Picker* output channel and the browser console, without throwing.

## Development

```powershell
# Install dependencies (npm is preferred for this package)
npm install

# Build the extension (lib + declarations)
npm run build

# Run unit tests
npm test
```

The package bundles Tailwind + shadcn/ui components through Vite. Generated output is emitted in `lib/` and published alongside `resources/icon.svg` for the widget icon.

# Theia FDC3 Desktop Agent Extension

This extension wires the core FDC3 Desktop Agent capabilities into the Theia-based
workspace platform. It exposes the FINOS FDC3 API to frontend applications,
routes context across workspace-scoped channels, and surfaces helper services
used by sample producer/consumer extensions.

## Features

- Workspace-aware FDC3 Desktop Agent implementation (`fdc3.broadcast`,
  `fdc3.addContextListener`, `fdc3.raiseIntent`, …)
- Browser proxy that injects `window.fdc3` and validates webview origins
- Electron preload script so sandboxed webviews can communicate with the host
- Sample producer/consumer VS Code extensions for manual testing
- Client picker widget broadcasts client contexts on selection

## Getting Started

1. Install dependencies for the main repository (`yarn` from the root).
2. Install extension-specific dependencies using npm:

   ```bash
   cd theia-fdc3-extensions/theia-fdc3-extension
   npm install
   ```

3. Build the extension:

   ```bash
   npm run build
   ```

4. Launch the browser application from the repository root:

   ```bash
   yarn browser build
   yarn browser start
   ```

5. (Optional) build the sample testing extensions for quick verification:

   ```bash
   cd ../fdc3-test-producer && npm install && npm run build
   cd ../fdc3-test-consumer && npm install && npm run build
   ```

## Using the FDC3 API

Applications running inside the platform can access the Desktop Agent via either
the global `window.fdc3` object or the `@finos/fdc3` helper:

```ts
import { getAgent } from "@finos/fdc3";

const agent = await getAgent();
await agent.broadcast({
  type: "fdc3.instrument",
  id: { ticker: "AAPL" },
});
```

Intent handlers can be registered in the same way:

```ts
const listener = await agent.addIntentListener("ViewChart", async (context) => {
  // handle incoming intent
});

// Later, dispose when the handler is no longer needed
await listener.unsubscribe();
```

The Desktop Agent implementation automatically scopes broadcasts and intents to
the active workspace channel. Sample test extensions live under
`theia-fdc3-extensions/fdc3-test-producer` and
`theia-fdc3-extensions/fdc3-test-consumer`.


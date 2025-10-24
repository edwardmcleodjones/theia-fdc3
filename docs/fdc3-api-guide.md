# FDC3 API Quick Reference

This guide summarises how to interact with the Desktop Agent that ships with
the Theia FDC3 Workspace Platform.

## Acquiring the Desktop Agent

Use the `@finos/fdc3` helper to obtain a reference to the Desktop Agent that is
scoped to the current workspace channel:

```ts
import { getAgent } from "@finos/fdc3";

const agent = await getAgent();
```

## Broadcasting Context

```ts
await agent.broadcast({
  type: "fdc3.instrument",
  name: "Apple Inc.",
  id: { ticker: "AAPL" },
});
```

Only apps within the same workspace will receive the context.

## Listening for Context

```ts
const listener = await agent.addContextListener("fdc3.instrument", (context) => {
  console.log("Instrument context received", context);
});

// Later when the listener is no longer required
await listener.unsubscribe();
```

Omit the context type (or pass `null`) to receive all broadcasts.

## Registering and Raising Intents

```ts
const intentListener = await agent.addIntentListener("ViewInstrument", async (context) => {
  // Render the instrument view and optionally return data
  return { type: "fdc3.instrument", id: context.id };
});

// Somewhere else
const resolution = await agent.raiseIntent("ViewInstrument", {
  type: "fdc3.instrument",
  id: { ticker: "AAPL" },
});

const result = await resolution.getResult();
```

When only a single handler exists the Desktop Agent will route the intent
automatically. The resolver UI will be introduced in a future iteration.


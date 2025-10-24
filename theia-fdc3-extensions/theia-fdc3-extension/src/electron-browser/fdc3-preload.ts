type RequestPayload = {
  action: string;
  payload: unknown;
  requestId: string;
};

const pending = new Map<
  string,
  {
    resolve(value: unknown): void;
    reject(reason?: unknown): void;
  }
>();

window.addEventListener("message", (event: MessageEvent) => {
  const data = event.data;
  if (!data || typeof data !== "object" || data.namespace !== "fdc3-host") {
    return;
  }

  const entry = pending.get(data.requestId);
  if (!entry) {
    return;
  }
  pending.delete(data.requestId);

  if (data.error) {
    entry.reject(new Error(data.error));
    return;
  }

  entry.resolve(data.response);
});

const send = (action: string, payload: unknown): Promise<unknown> => {
  const requestId = `${action}:${Date.now()}:${Math.random()}`;
  return new Promise((resolve, reject) => {
    pending.set(requestId, { resolve, reject });
    const message: RequestPayload = {
      action,
      payload,
      requestId,
    };
    window.parent.postMessage(
      {
        namespace: "fdc3",
        ...message,
      },
      "*",
    );
  });
};

const preloadDesktopAgent = {
  broadcast(context: unknown) {
    return send("broadcast", { context });
  },
  raiseIntent(intent: string, context?: unknown, target?: unknown) {
    return send("raiseIntent", { intent, context, target });
  },
};

(window as unknown as { fdc3: typeof preloadDesktopAgent }).fdc3 = preloadDesktopAgent;

export {};

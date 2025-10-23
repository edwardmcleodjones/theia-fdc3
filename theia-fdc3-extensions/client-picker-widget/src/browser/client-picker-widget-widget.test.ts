import "reflect-metadata";
import { Container, ContainerModule } from "@theia/core/shared/inversify";
import { render } from "@testing-library/react";
import type { DesktopAgent } from "@finos/fdc3";
import { ClientPickerWidgetWidget } from "./client-picker-widget-widget";
import { CLIENTS } from "./clients";

describe("ClientPickerWidgetWidget", () => {
  let widget: ClientPickerWidgetWidget;

  beforeEach(() => {
    const module = new ContainerModule((bind) => {
      bind(ClientPickerWidgetWidget).toSelf();
    });
    const container = new Container();
    container.load(module);
    widget = container.resolve(ClientPickerWidgetWidget);
  });

  afterEach(() => {
    // Clean up any FDC3 stubs we add during tests.
    delete (window as Window & { fdc3?: unknown }).fdc3;
  });

  it("renders the client directory instructions", () => {
    const element = render(widget.render());
    expect(
      element.getByText("Select a client to broadcast their FDC3 context to the active workspace.")
    ).toBeTruthy();
  });

  it("broadcasts an FDC3 client context when a client is selected", async () => {
    const broadcast = jest.fn().mockResolvedValue(undefined);
    (window as Window & { fdc3?: unknown }).fdc3 = {
      broadcast,
    } as unknown as DesktopAgent;
    const client = CLIENTS[0];

    await widget["broadcastClientContext"](client);

    expect(broadcast).toHaveBeenCalledWith({
      type: "fdc3.client",
      name: client.name,
      id: { clientId: client.clientId },
    });
  });

  it("falls back gracefully when FDC3 is unavailable", async () => {
    const warnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
    const client = CLIENTS[1];

    await widget["broadcastClientContext"](client);

    expect(widget["status"]).toEqual({
      variant: "warning",
      message:
        "FDC3 Desktop Agent is not available; unable to broadcast client context.",
    });
    warnSpy.mockRestore();
  });
});

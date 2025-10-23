import * as React from "react";
import {
  injectable,
  postConstruct,
  inject,
  optional,
} from "@theia/core/shared/inversify";
import { AlertMessage } from "@theia/core/lib/browser/widgets/alert-message";
import { ReactWidget } from "@theia/core/lib/browser/widgets/react-widget";
import type { Context, DesktopAgent } from "@finos/fdc3";
import { OutputChannelManager } from "@theia/output/lib/browser/output-channel";
import type { OutputChannel } from "@theia/output/lib/browser/output-channel";

import {
  CLIENT_PICKER_OUTPUT_CHANNEL,
  CLIENTS,
  type ClientSummary,
} from "./clients";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/browser/components/ui/card";
import { Button } from "@/browser/components/ui/button";

@injectable()
export class ClientPickerWidgetWidget extends ReactWidget {
  static readonly ID = "client-picker-widget:widget";
  static readonly LABEL = "Client Picker";

  @inject(OutputChannelManager)
  @optional()
  protected readonly outputChannelManager?: OutputChannelManager;

  protected readonly clients: readonly ClientSummary[] = CLIENTS;
  protected outputChannel?: OutputChannel;
  protected selectedClientId?: string;
  protected status?:
    | { variant: "success"; message: string }
    | { variant: "warning"; message: string }
    | { variant: "error"; message: string };

  @postConstruct()
  protected init(): void {
    this.doInit();
  }

  protected async doInit(): Promise<void> {
    this.id = ClientPickerWidgetWidget.ID;
    this.title.label = ClientPickerWidgetWidget.LABEL;
    this.title.caption = ClientPickerWidgetWidget.LABEL;
    this.title.closable = true;
    this.title.iconClass = "fa fa-crosshairs";
    this.outputChannel = this.outputChannelManager?.getChannel(
      CLIENT_PICKER_OUTPUT_CHANNEL
    );
    this.update();
  }

  render(): React.ReactElement {
    return (
      <div
        id="widget-container"
        className="client-picker-widget flex h-full flex-col gap-3 p-4"
      >
        <header className="flex flex-col gap-1">
          <h1 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Client Directory
          </h1>
          <p className="text-sm text-muted-foreground">
            Select a client to broadcast their FDC3 context to the active
            workspace.
          </p>
        </header>
        {this.renderStatus()}
        <div className="client-list flex-1 space-y-3 overflow-y-auto pr-1">
          {this.clients.map((client) => this.renderClientCard(client))}
        </div>
      </div>
    );
  }

  protected renderStatus(): React.ReactNode {
    if (!this.status) {
      return null;
    }
    const type =
      this.status.variant === "success"
        ? "SUCCESS"
        : this.status.variant === "warning"
        ? "WARNING"
        : "ERROR";

    return <AlertMessage type={type} header={this.status.message} />;
  }

  protected renderClientCard(client: ClientSummary): React.ReactElement {
    const isSelected = this.selectedClientId === client.clientId;
    return (
      <Card
        key={client.clientId}
        className={`transition-all ${
          isSelected
            ? "border-primary shadow-md ring-2 ring-primary/30"
            : "hover:shadow"
        }`}
      >
        <CardHeader className="gap-1">
          <CardTitle className="text-base">{client.name}</CardTitle>
          <CardDescription className="text-xs uppercase tracking-wide">
            {client.segment}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
          <span>{client.location}</span>
          {client.notes ? <span>{client.notes}</span> : null}
        </CardContent>
        <div className="px-6 pb-6">
          <Button
            className="w-full"
            variant={isSelected ? "secondary" : "default"}
            onClick={() => this.handleClientSelection(client)}
          >
            {isSelected ? "Selected" : "Broadcast Context"}
          </Button>
        </div>
      </Card>
    );
  }

  protected handleClientSelection(client: ClientSummary): void {
    this.selectedClientId = client.clientId;
    this.setStatus(undefined);
    void this.broadcastClientContext(client);
  }

  protected async broadcastClientContext(client: ClientSummary): Promise<void> {
    const context = {
      type: "fdc3.client",
      name: client.name,
      id: {
        clientId: client.clientId,
      },
    } satisfies Context;

    const agent = (window as Window & { fdc3?: DesktopAgent }).fdc3;
    if (!agent || typeof agent.broadcast !== "function") {
      const message =
        "FDC3 Desktop Agent is not available; unable to broadcast client context.";
      this.setStatus({ variant: "warning", message });
      this.log("warn", message);
      return;
    }

    try {
      await agent.broadcast(context);
      const message = `Broadcasted client context for ${client.name} (${client.clientId}).`;
      this.setStatus({ variant: "success", message });
      this.log("info", message);
    } catch (error) {
      const message = `Failed to broadcast context for ${client.name}.`;
      this.setStatus({ variant: "error", message });
      this.log("error", `${message} ${this.formatError(error)}`);
    }
  }

  protected setStatus(
    status:
      | { variant: "success"; message: string }
      | { variant: "warning"; message: string }
      | { variant: "error"; message: string }
      | undefined
  ): void {
    this.status = status;
    this.update();
  }

  protected log(level: "info" | "warn" | "error", message: string): void {
    const line = `[ClientPicker] ${message}`;
    if (this.outputChannel) {
      this.outputChannel.appendLine(line);
    } else {
      const logger = console[level] ?? console.log;
      logger.call(console, line);
    }
  }

  protected formatError(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === "string") {
      return error;
    }
    try {
      return JSON.stringify(error);
    } catch {
      return String(error);
    }
  }
}

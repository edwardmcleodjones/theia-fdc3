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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/browser/components/ui/table";
import { Input } from "@/browser/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/browser/components/ui/select";
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
  protected nameFilter: string = "";
  protected industryFilter: string = "all";
  protected locationFilter: string = "";
  protected lastVisitFilter: string = "";

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
    const filteredClients = this.getFilteredClients();
    const industries = this.getUniqueIndustries();

    return (
      <div
        id="widget-container"
        className="dark client-picker-widget flex h-full flex-col gap-3 p-4"
      >
        <header className="flex flex-col gap-1">
          {/* <h1 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Client Directory
          </h1> */}
          <p className="text-sm text-muted-foreground">
            Select a client to broadcast their FDC3 context to the active
            workspace.
          </p>
        </header>
        {this.renderStatus()}
        {this.renderFilters(industries)}
        <div className="flex-1 overflow-auto">
          {this.renderTable(filteredClients)}
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

  protected renderFilters(industries: string[]): React.ReactElement {
    return (
      <div className="flex flex-wrap gap-2">
        <Input
          placeholder="Search name..."
          value={this.nameFilter}
          onChange={(e) => {
            this.nameFilter = e.target.value;
            this.update();
          }}
          className="min-w-[150px] flex-1"
        />
        <Select
          value={this.industryFilter}
          onValueChange={(value) => {
            this.industryFilter = value;
            this.update();
          }}
        >
          <SelectTrigger className="min-w-[150px] flex-1">
            <SelectValue placeholder="All" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {industries.map((industry) => (
              <SelectItem key={industry} value={industry}>
                {industry}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder="Search location..."
          value={this.locationFilter}
          onChange={(e) => {
            this.locationFilter = e.target.value;
            this.update();
          }}
          className="min-w-[150px] flex-1"
        />
        <Button
          variant="outline"
          onClick={() => {
            this.nameFilter = "";
            this.industryFilter = "all";
            this.locationFilter = "";
            this.update();
          }}
          className="min-w-20"
        >
          Clear
        </Button>
      </div>
    );
  }

  protected renderTable(clients: ClientSummary[]): React.ReactElement {
    return (
      <div className="@container rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="border-b bg-muted/50 hover:bg-muted/50">
              <TableHead className="font-semibold">Client Name</TableHead>
              <TableHead className="hidden font-semibold @[600px]:table-cell">
                Industry
              </TableHead>
              <TableHead className="hidden font-semibold @[600px]:table-cell">
                Location
              </TableHead>
              <TableHead className="font-semibold">Last Visit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground"
                >
                  No clients found
                </TableCell>
              </TableRow>
            ) : (
              clients.map((client) => this.renderTableRow(client))
            )}
          </TableBody>
        </Table>
      </div>
    );
  }

  protected renderTableRow(client: ClientSummary): React.ReactElement {
    const isSelected = this.selectedClientId === client.clientId;
    return (
      <TableRow
        key={client.clientId}
        className={`cursor-pointer border-b transition-colors ${
          isSelected
            ? "bg-primary/20 hover:bg-primary/25"
            : "hover:bg-accent/50"
        }`}
        onClick={() => this.handleClientSelection(client)}
      >
        <TableCell className="font-medium text-foreground">
          <div className="flex flex-col gap-1">
            <span>{client.name}</span>
            <div className="flex flex-col text-xs text-muted-foreground @[600px]:hidden">
              <span>{client.segment}</span>
              <span>{client.location}</span>
            </div>
          </div>
        </TableCell>
        <TableCell className="hidden text-muted-foreground @[600px]:table-cell">
          {client.segment}
        </TableCell>
        <TableCell className="hidden text-muted-foreground @[600px]:table-cell">
          {client.location}
        </TableCell>
        <TableCell className="text-muted-foreground">
          {client.lastVisit}
        </TableCell>
      </TableRow>
    );
  }

  protected getUniqueIndustries(): string[] {
    const industries = new Set(this.clients.map((c) => c.segment));
    return Array.from(industries).sort();
  }

  protected getFilteredClients(): ClientSummary[] {
    return this.clients.filter((client) => {
      const nameMatch =
        this.nameFilter === "" ||
        client.name.toLowerCase().includes(this.nameFilter.toLowerCase());

      const industryMatch =
        this.industryFilter === "all" || client.segment === this.industryFilter;

      const locationMatch =
        this.locationFilter === "" ||
        client.location
          .toLowerCase()
          .includes(this.locationFilter.toLowerCase());

      return nameMatch && industryMatch && locationMatch;
    });
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

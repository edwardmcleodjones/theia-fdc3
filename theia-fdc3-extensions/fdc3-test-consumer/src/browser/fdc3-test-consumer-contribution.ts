import { inject, injectable } from "@theia/core/shared/inversify";
import { MessageService } from "@theia/core/lib/common/message-service";
import { Disposable, DisposableCollection } from "@theia/core/lib/common/disposable";
import {
  Command,
  CommandContribution,
  CommandRegistry,
} from "@theia/core/lib/common/command";
import { FrontendApplicationContribution } from "@theia/core/lib/browser/frontend-application-contribution";
import { getAgent, Listener, DesktopAgent } from "@finos/fdc3";

const SHOW_STATUS_COMMAND: Command = {
  id: "fdc3-test-consumer.showStatus",
  category: "FDC3 Test Consumer",
  label: "Show Consumer Status",
};

const START_LISTENING_COMMAND: Command = {
  id: "fdc3-test-consumer.startListening",
  category: "FDC3 Test Consumer",
  label: "Enable Context Listening",
};

const STOP_LISTENING_COMMAND: Command = {
  id: "fdc3-test-consumer.stopListening",
  category: "FDC3 Test Consumer",
  label: "Disable Context Listening",
};

@injectable()
export class Fdc3TestConsumerContribution
  implements FrontendApplicationContribution, CommandContribution, Disposable
{
  private readonly toDispose = new DisposableCollection();
  private status: "idle" | "listening" | "error" = "idle";
  private listener?: Listener;
  private agent?: DesktopAgent;

  constructor(@inject(MessageService) private readonly messageService: MessageService) {}

  async onStart(): Promise<void> {
    this.status = "idle";
  }

  registerCommands(commands: CommandRegistry): void {
    commands.registerCommand(SHOW_STATUS_COMMAND, {
      execute: () => {
        switch (this.status) {
          case "listening":
            this.messageService.info("FDC3 Test Consumer is listening for contexts.");
            break;
          case "error":
            this.messageService.error(
              "FDC3 Test Consumer encountered an error during initialisation.",
            );
            break;
          default:
            this.messageService.info("FDC3 Test Consumer is not listening.");
        }
      },
    });

    commands.registerCommand(START_LISTENING_COMMAND, {
      execute: () => {
        if (this.status === "listening") {
          this.messageService.info("FDC3 Test Consumer is already listening.");
          return;
        }
        void this.startListening();
      },
    });

    commands.registerCommand(STOP_LISTENING_COMMAND, {
      execute: () => {
        if (this.listener) {
          void this.listener.unsubscribe();
          this.listener = undefined;
          this.status = "idle";
          this.messageService.info("FDC3 Test Consumer: stopped listening.");
        } else {
          this.messageService.info("FDC3 Test Consumer is not currently listening.");
        }
      },
    });
  }

  dispose(): void {
    this.toDispose.dispose();
    if (this.listener) {
      void this.listener.unsubscribe();
      this.listener = undefined;
    }
  }

  private async startListening(): Promise<void> {
    try {
      this.agent = this.agent ?? (await getAgent());
      this.listener = await this.agent.addContextListener(null, (context) => {
        const summary = this.describeContext(context);
        this.messageService.info(`FDC3 context received: ${summary}`);
      });
      this.toDispose.push(
        Disposable.create(() => {
          void this.listener?.unsubscribe();
        }),
      );
      this.status = "listening";
      this.messageService.info("FDC3 Test Consumer: listening for contexts.");
    } catch (error) {
      this.status = "error";
      this.messageService.error(
        `FDC3 Test Consumer failed to initialise: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  private describeContext(context: unknown): string {
    if (!context || typeof context !== "object") {
      return "[malformed context]";
    }

    const base = (context as { type?: string; name?: string; id?: Record<string, unknown> }).type ?? "context";

    if (base === "fdc3.client") {
      const client = context as { name?: string; id?: { clientId?: string } };
      const name = client.name ?? "Unknown Client";
      const clientId = client.id?.clientId;
      return clientId ? `${name} (${clientId})` : `${name}`;
    }

    if (base === "fdc3.instrument") {
      const instrument = context as { name?: string; id?: { ticker?: string } };
      const label = instrument.name ?? instrument.id?.ticker;
      return label ? `${label} [${base}]` : base;
    }

    return base;
  }
}

import { inject, injectable } from "@theia/core/shared/inversify";
import {
  CommandContribution,
  CommandRegistry,
  Command,
} from "@theia/core/lib/common/command";
import { MessageService } from "@theia/core/lib/common/message-service";
import { getAgent } from "@finos/fdc3";

const BROADCAST_SAMPLE_COMMAND: Command = {
  id: "fdc3-test-producer.broadcastSample",
  category: "FDC3 Test Producer",
  label: "Broadcast Sample FDC3 Context",
};

@injectable()
export class Fdc3TestProducerContribution implements CommandContribution {
  constructor(@inject(MessageService) private readonly messageService: MessageService) {}

  registerCommands(registry: CommandRegistry): void {
    registry.registerCommand(BROADCAST_SAMPLE_COMMAND, {
      execute: async () => {
        try {
          const agent = await getAgent();
          const sampleContext = {
            type: "fdc3.instrument",
            id: {
              ticker: "AAPL",
              ISIN: "US0378331005",
            },
            name: "Apple Inc.",
          };
          await agent.broadcast(sampleContext);
          this.messageService.info(
            `FDC3 broadcast sent: ${sampleContext.name} (${sampleContext.id.ticker}).`,
          );
        } catch (error) {
          this.messageService.error(
            `Failed to broadcast FDC3 context: ${
              error instanceof Error ? error.message : String(error)
            }`,
          );
        }
      },
    });
  }
}


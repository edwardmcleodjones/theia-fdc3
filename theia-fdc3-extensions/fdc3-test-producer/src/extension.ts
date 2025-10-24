import * as vscode from "vscode";
import { getAgent } from "@finos/fdc3";

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  const disposable = vscode.commands.registerCommand(
    "fdc3-test-producer.broadcastSample",
    async () => {
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
        vscode.window.showInformationMessage(
          `FDC3 broadcast sent: ${sampleContext.name} (${sampleContext.id.ticker})`,
        );
      } catch (error) {
        vscode.window.showErrorMessage(
          `Failed to broadcast FDC3 context: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
      }
    },
  );

  context.subscriptions.push(disposable);
}

export function deactivate(): void {
  // Nothing to clean up.
}


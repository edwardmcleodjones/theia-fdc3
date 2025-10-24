import * as vscode from "vscode";
import { getAgent, Listener } from "@finos/fdc3";

let contextListener: Listener | undefined;

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  try {
    const agent = await getAgent();
    contextListener = await agent.addContextListener(null, (ctx) => {
      const summary = ctx.type ? `${ctx.type}` : "context";
      vscode.window.showInformationMessage(`FDC3 context received (${summary})`);
    });
    context.subscriptions.push(
      new vscode.Disposable(() => {
        void contextListener?.unsubscribe();
        contextListener = undefined;
      }),
    );
  } catch (error) {
    vscode.window.showErrorMessage(
      `Failed to initialise FDC3 consumer: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
}

export async function deactivate(): Promise<void> {
  await contextListener?.unsubscribe();
  contextListener = undefined;
}


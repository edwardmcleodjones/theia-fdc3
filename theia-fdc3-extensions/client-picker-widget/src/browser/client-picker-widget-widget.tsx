import * as React from "react";
import {
  injectable,
  postConstruct,
  inject,
} from "@theia/core/shared/inversify";
import { AlertMessage } from "@theia/core/lib/browser/widgets/alert-message";
import { ReactWidget } from "@theia/core/lib/browser/widgets/react-widget";
import { MessageService } from "@theia/core";
import { Message } from "@theia/core/lib/browser";

import { Card } from "@/browser/components/ui/card";
import { Button } from "@/browser/components/ui/button";

@injectable()
export class ClientPickerWidgetWidget extends ReactWidget {
  static readonly ID = "client-picker-widget:widget";
  static readonly LABEL = "Client Picker";

  @inject(MessageService)
  protected readonly messageService!: MessageService;

  @postConstruct()
  protected init(): void {
    this.doInit();
  }

  protected async doInit(): Promise<void> {
    this.id = ClientPickerWidgetWidget.ID;
    this.title.label = ClientPickerWidgetWidget.LABEL;
    this.title.caption = ClientPickerWidgetWidget.LABEL;
    this.title.closable = true;
    this.title.iconClass = "fa fa-window-maximize"; // example widget icon.
    this.update();
  }

  render(): React.ReactElement {
    const header = `This is a sample widget which simply calls the messageService
        in order to display an info message to end users.`;
    return (
      <div id="widget-container">
        <AlertMessage type="INFO" header={header} />
        <Card className="p-6">
          <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md">
            Tailwind Test
          </div>
          <Button>A shadcn button!</Button>
        </Card>
        <button
          id="displayMessageButton"
          className="theia-button secondary"
          title="Display Message"
          onClick={(_a) => this.displayMessage()}
        >
          Display Message
        </button>
      </div>
    );
  }

  protected displayMessage(): void {
    this.messageService.info(
      "Congratulations: ClientPickerWidget Widget Successfully Created!"
    );
  }

  protected onActivateRequest(msg: Message): void {
    super.onActivateRequest(msg);
    const htmlElement = document.getElementById("displayMessageButton");
    if (htmlElement) {
      htmlElement.focus();
    }
  }
}

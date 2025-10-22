import { ContainerModule } from "@theia/core/shared/inversify";
import { ClientPickerWidgetWidget } from "./client-picker-widget-widget";
import { ClientPickerWidgetContribution } from "./client-picker-widget-contribution";
import {
  bindViewContribution,
  FrontendApplicationContribution,
  WidgetFactory,
} from "@theia/core/lib/browser";

import "../../src/browser/style/index.css";

export default new ContainerModule((bind) => {
  bindViewContribution(bind, ClientPickerWidgetContribution);
  bind(FrontendApplicationContribution).toService(
    ClientPickerWidgetContribution
  );
  bind(ClientPickerWidgetWidget).toSelf();
  bind(WidgetFactory)
    .toDynamicValue((ctx) => ({
      id: ClientPickerWidgetWidget.ID,
      createWidget: () =>
        ctx.container.get<ClientPickerWidgetWidget>(ClientPickerWidgetWidget),
    }))
    .inSingletonScope();
});

import { ContainerModule } from "@theia/core/shared/inversify";
import { ClientPickerWidgetWidget } from "./client-picker-widget-widget";
import { ClientPickerContribution } from "./ClientPickerContribution";
import {
  bindViewContribution,
  FrontendApplicationContribution,
  WidgetFactory,
} from "@theia/core/lib/browser";

import "../../src/browser/style/index.css";

export default new ContainerModule((bind) => {
  bindViewContribution(bind, ClientPickerContribution);
  bind(FrontendApplicationContribution).toService(
    ClientPickerContribution
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

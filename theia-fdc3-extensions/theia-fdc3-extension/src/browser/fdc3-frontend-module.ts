import { ContainerModule } from "@theia/core/shared/inversify";
import { FrontendApplicationContribution } from "@theia/core/lib/browser/frontend-application-contribution";
import { FDC3_SYMBOLS, bindOrRebindSingleton } from "@theia-fdc3/fdc3/fdc3-di-module";
import { Fdc3FrontendProxy } from "@theia-fdc3/browser/fdc3-frontend-proxy";

export default new ContainerModule((bind, unbind, isBound, rebind) => {
  bindOrRebindSingleton(bind, rebind, isBound, FDC3_SYMBOLS.FrontendProxy, Fdc3FrontendProxy);
  bind(Fdc3FrontendProxy).toService(FDC3_SYMBOLS.FrontendProxy);
  bind(FrontendApplicationContribution)
    .toDynamicValue((ctx) => ({
      onStart: async () => {
        await Promise.resolve(ctx.container.get(FDC3_SYMBOLS.FrontendProxy));
      },
    }))
    .inSingletonScope();
});

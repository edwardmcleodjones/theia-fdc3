import { ContainerModule } from "@theia/core/shared/inversify";
import { CommandContribution } from "@theia/core/lib/common/command";
import { FrontendApplicationContribution } from "@theia/core/lib/browser/frontend-application-contribution";
import { Fdc3TestConsumerContribution } from "./fdc3-test-consumer-contribution";

export default new ContainerModule((bind) => {
  bind(Fdc3TestConsumerContribution).toSelf().inSingletonScope();
  bind(CommandContribution).toService(Fdc3TestConsumerContribution);
  bind(FrontendApplicationContribution).toService(Fdc3TestConsumerContribution);
});

import { ContainerModule } from "@theia/core/shared/inversify";
import { CommandContribution } from "@theia/core/lib/common/command";
import { Fdc3TestProducerContribution } from "./fdc3-test-producer-contribution";

export default new ContainerModule((bind) => {
  bind(Fdc3TestProducerContribution).toSelf().inSingletonScope();
  bind(CommandContribution).toService(Fdc3TestProducerContribution);
});


import { ContainerModule } from "@theia/core/shared/inversify";
import { ConnectionHandler, JsonRpcConnectionHandler } from "@theia/core/lib/common/messaging";
import { FDC3_SYMBOLS, bindOrRebindSingleton } from "@theia-fdc3/fdc3/fdc3-di-module";
import { WorkspaceContextBusService } from "@theia-fdc3/fdc3/services/workspace-context-bus.service";
import { WorkspaceChannelMapperService } from "@theia-fdc3/fdc3/services/workspace-channel-mapper.service";
import { ContextValidatorService } from "@theia-fdc3/fdc3/services/context-validator.service";
import { IntentRegistryService } from "@theia-fdc3/fdc3/services/intent-registry.service";
import { InMemoryWorkspaceResolver } from "@theia-fdc3/fdc3/services/workspace-resolver.service";
import { DesktopAgentImpl } from "@theia-fdc3/fdc3/services/desktop-agent.service";
import { Fdc3LoggerService } from "@theia-fdc3/fdc3/services/fdc3-logger.service";
import { FDC3_SERVICE_PATH } from "@theia-fdc3/common/fdc3-protocol";
import type { Fdc3Client } from "@theia-fdc3/common/fdc3-protocol";
import { Fdc3ServiceImpl } from "@theia-fdc3/node/fdc3-backend-service";

export default new ContainerModule((bind, unbind, isBound, rebind) => {
  bindOrRebindSingleton(bind, rebind, isBound, FDC3_SYMBOLS.WorkspaceContextBus, WorkspaceContextBusService);
  bindOrRebindSingleton(bind, rebind, isBound, FDC3_SYMBOLS.WorkspaceChannelMapper, WorkspaceChannelMapperService);
  bindOrRebindSingleton(bind, rebind, isBound, FDC3_SYMBOLS.ContextValidator, ContextValidatorService);
  bindOrRebindSingleton(bind, rebind, isBound, FDC3_SYMBOLS.IntentRegistry, IntentRegistryService);
  bindOrRebindSingleton(bind, rebind, isBound, FDC3_SYMBOLS.WorkspaceResolver, InMemoryWorkspaceResolver);
  bindOrRebindSingleton(bind, rebind, isBound, FDC3_SYMBOLS.DesktopAgent, DesktopAgentImpl);
  bindOrRebindSingleton(bind, rebind, isBound, FDC3_SYMBOLS.Logger, Fdc3LoggerService);

  if (!isBound(Fdc3ServiceImpl)) {
    bind(Fdc3ServiceImpl).toSelf().inSingletonScope();
  }

  bind(ConnectionHandler)
    .toDynamicValue((ctx) => {
      return new JsonRpcConnectionHandler<Fdc3Client>(FDC3_SERVICE_PATH, (client) => {
        const service = ctx.container.get(Fdc3ServiceImpl);
        service.setClient(client);
        return service;
      });
    })
    .inSingletonScope();
});

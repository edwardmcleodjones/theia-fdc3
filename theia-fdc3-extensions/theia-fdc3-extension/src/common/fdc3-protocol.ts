import type {
  AppIdentifier,
  AppIntent,
  AppMetadata,
  Channel,
  Context,
  ImplementationMetadata,
  Intent,
  IntentResult,
} from "@finos/fdc3";
import type { RpcServer } from "@theia/core/lib/common/messaging/proxy-factory";
import type { ContextFilter } from "@theia-fdc3/fdc3/types/context.interface";
import type { IntentName } from "@theia-fdc3/fdc3/types/intent.interface";
import type { ChannelId } from "@theia-fdc3/fdc3/types/channel.interface";

export const FDC3_SERVICE_PATH = "/services/fdc3";

export interface Fdc3Client {
  onContext(listenerId: string, context: Context): void;
  onIntent(listenerId: string, context: Context): Promise<IntentResult | void>;
}

export interface IntentResolutionPlain {
  readonly source: AppIdentifier;
  readonly intent: Intent;
  readonly result?: IntentResult;
}

export interface ChannelPlain {
  readonly id: ChannelId;
  readonly type?: string;
  readonly displayMetadata?: {
    readonly name?: string;
    readonly color?: string;
  };
}

export interface Fdc3Service extends RpcServer<Fdc3Client> {
  broadcast(context: Context): Promise<void>;
  registerContextListener(filter: ContextFilter | null): Promise<string>;
  registerIntentListener(intent: IntentName, contextType: ContextFilter | null): Promise<string>;
  unregisterListener(listenerId: string): Promise<void>;
  raiseIntent(
    intent: IntentName,
    context?: Context | null,
    target?: AppIdentifier | string,
  ): Promise<IntentResolutionPlain>;
  findIntent(intent: IntentName, context?: Context | null): Promise<AppIntent>;
  findIntentsByContext(context: Context): Promise<AppIntent[]>;
  getOrCreateChannel(channelId: ChannelId): Promise<ChannelPlain>;
  getCurrentChannel(): Promise<ChannelPlain | null>;
  leaveCurrentChannel(): Promise<void>;
  getInfo(): Promise<ImplementationMetadata>;
  getAppMetadata(app: AppIdentifier): Promise<AppMetadata>;
}

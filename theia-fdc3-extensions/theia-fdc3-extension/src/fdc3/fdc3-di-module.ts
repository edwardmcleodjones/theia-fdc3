import { interfaces } from "@theia/core/shared/inversify";

/**
 * Central place for all FDC3 related binding identifiers. Keeping the symbols
 * here avoids magic strings sprinkled across frontend/backend modules.
 */
export const FDC3_SYMBOLS = Object.freeze({
  DesktopAgent: Symbol.for("fdc3.DesktopAgent"),
  WorkspaceContextBus: Symbol.for("fdc3.WorkspaceContextBus"),
  WorkspaceChannelMapper: Symbol.for("fdc3.WorkspaceChannelMapper"),
  ContextValidator: Symbol.for("fdc3.ContextValidator"),
  IntentRegistry: Symbol.for("fdc3.IntentRegistry"),
  WorkspaceResolver: Symbol.for("fdc3.WorkspaceResolver"),
  Logger: Symbol.for("fdc3.Logger"),
  FrontendProxy: Symbol.for("fdc3.FrontendProxy"),
});

/**
 * Convenience binding helper so both frontend and backend modules can bind
 * singleton services without repeating the same boilerplate.
 */
export const bindSingleton = <T>(
  bind: interfaces.Bind,
  identifier: interfaces.ServiceIdentifier<T>,
  ctor: interfaces.Newable<T>,
): void => {
  bind(identifier).to(ctor).inSingletonScope();
};

/**
 * Occasionally we need to swap implementations (e.g. testing) without worrying
 * about whether the binding already exists. This helper mirrors `bindSingleton`
 * but uses rebind when a previous binding is present.
 */
export const bindOrRebindSingleton = <T>(
  bind: interfaces.Bind,
  rebind: interfaces.Rebind,
  isBound: interfaces.IsBound,
  identifier: interfaces.ServiceIdentifier<T>,
  ctor: interfaces.Newable<T>,
): void => {
  if (isBound(identifier)) {
    rebind(identifier).to(ctor).inSingletonScope();
    return;
  }
  bindSingleton(bind, identifier, ctor);
};

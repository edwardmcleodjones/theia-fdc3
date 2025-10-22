import "../style/application-shell.less";

import {
  ApplicationShell as TheiaApplicationShell,
  DockPanel,
  FrontendApplication as TheiaFrontendApplication,
  FrontendApplicationContribution,
  SidePanelHandlerFactory,
  TheiaSplitPanel,
  Widget,
  type Layout,
} from "@theia/core/lib/browser";

import { TheiaDockPanel } from "@theia/core/lib/browser/shell/theia-dock-panel";
import { ElementExt } from "@theia/core/shared/@lumino/domutils";
import {
  injectable,
  postConstruct,
  type interfaces,
} from "@theia/core/shared/inversify";

import { FrontendApplication } from "./frontend-application";
import { ShellInitContribution } from "./shell-init-contribution";
// import { SidePanelHandler } from "./side-panel-handler";

export function initApplicationShell({
  bind,
  rebind,
}: {
  bind: interfaces.Bind;
  rebind: interfaces.Rebind;
}): void {
  // Rebind application shell
  rebind(TheiaApplicationShell).to(ApplicationShell).inSingletonScope();

  // Rebind frontend application
  rebind(TheiaFrontendApplication).to(FrontendApplication).inSingletonScope();

  // Shell init contribution
  bind(ShellInitContribution).toSelf().inSingletonScope();
  bind(FrontendApplicationContribution).toService(ShellInitContribution);

  //   // Side panel handler
  //   bind(SidePanelHandler).toSelf();
  //   rebind(SidePanelHandlerFactory).toAutoFactory(SidePanelHandler);
}

@injectable()
export class ApplicationShell extends TheiaApplicationShell {
  // @postConstruct()
  // protected init(): void {
  //     // Disable right / bottom panels (for dragging)
  //     this.options = {
  //         leftPanel: {
  //             ...this.options.leftPanel,
  //             initialSizeRatio: 0.25, // 25% of window width
  //         },
  //         bottomPanel: {
  //             ...this.options.bottomPanel,
  //             emptySize: 0,
  //             expandDuration: 0,
  //             initialSizeRatio: 0.2, // 20% of window height
  //         },
  //         rightPanel: {
  //             ...this.options.rightPanel,
  //             emptySize: 0,
  //             expandThreshold: 0,
  //             initialSizeRatio: 0,
  //         },
  //     };

  //     super.init();
  //     this.restrictDragging();
  // }

  // // NOTE: Right now is left :D
  // getInsertionOptions(options?: TheiaApplicationShell.WidgetOptions) {
  //     if (options?.area === 'right') {
  //         options.area = 'left';
  //     }

  //     return super.getInsertionOptions(options);
  // }

  // // NOOP, dragging has been disabled
  // override handleEvent(event: Event): void {
  //     switch (event.type) {
  //         case 'lm-dragenter':
  //         case 'lm-dragleave':
  //         case 'lm-dragover':
  //         case 'lm-drop':
  //             return;
  //     }

  //     return super.handleEvent(event);
  // }

  // /**
  //  * Restrict dragging from/to bottom panel
  //  */
  // protected restrictDragging(): void {
  //     const proto = TheiaDockPanel.prototype as any;

  //     if (proto._patchedDropBlocker) {
  //         return;
  //     }

  //     const originalHandleEvent = proto.handleEvent;
  //     const originalShowOverlay = proto._showOverlay;
  //     const originalAddWidget = proto.addWidget;

  //     proto.handleEvent = function(event: Event & { source?: TheiaDockPanel }): any {
  //         const el = this.node;
  //         const toSidePanel = !!el.closest('.theia-side-panel');
  //         const toBottomPanel = !!el.closest('[id="theia-bottom-content-panel"]');

  //         // @ts-ignore
  //         const isNotFromDockPanel = !event.source;

  //         // @ts-ignore
  //         const fromBottomPanel = !!(event.source?.id === 'theia-bottom-content-panel');

  //         // Don't allow to drag from outside of the dock panel (allow only dragging between dock panels)
  //         if (isNotFromDockPanel) {
  //             return;
  //         }

  //         // Any kind of dragging has been disabled for bottom panel
  //         if (fromBottomPanel || toBottomPanel) {
  //             return;
  //         }

  //         // Cant drop to side panels
  //         if (toSidePanel && ['lm-dragenter', 'lm-dragleave', 'lm-dragover', 'lm-drop'].includes(event.type)) {
  //             return;
  //         }

  //         return originalHandleEvent.call(this, event);
  //     };

  //     // Don't allow to show overlay on top/bottom of the dock panel
  //     proto._showOverlay = function(this: DockPanel, clientX: number, clientY: number): string {
  //         const zone = originalShowOverlay.call(this, clientX, clientY) as string;
  //         const overlay = this.overlay;

  //         if (['widget-top', 'widget-bottom', 'root-top', 'root-bottom', 'widget-tab'].includes(zone)) {
  //             const box = ElementExt.boxSizing(this.node);

  //             overlay.show({
  //                 top: box.paddingTop,
  //                 left: box.paddingLeft,
  //                 right: box.paddingRight,
  //                 bottom: box.paddingBottom,
  //             });

  //             return 'widget-all';
  //         }

  //         return zone;
  //     };

  //     proto.addWidget = function(
  //         widget: Widget,
  //         options?: DockPanel.IAddOptions
  //     ): void {
  //         if (options?.mode === 'split-top' || options?.mode === 'split-bottom') {
  //             options.mode = 'tab-after';
  //         }

  //         return originalAddWidget.call(this, widget, options);
  //     };

  //     proto._patchedDropBlocker = true;
  // }

  /**
   * Create a custom layout for the application shell
   */
  protected createLayout(): Layout {
    const SPACING = 6;

    const bottomSplitLayout = this.createSplitLayout(
      [this.mainPanel, this.bottomPanel],
      [1, 0],
      { orientation: "vertical", spacing: SPACING }
    );
    const panelForBottomArea = new TheiaSplitPanel({
      layout: bottomSplitLayout,
    });

    panelForBottomArea.id = "theia-bottom-split-panel";

    const leftRightSplitLayout = this.createSplitLayout(
      [
        this.leftPanelHandler.container,
        panelForBottomArea,
        this.rightPanelHandler.container,
      ],
      [0, 1, 0],
      { orientation: "horizontal", spacing: SPACING }
    );
    const mainIDEPanel = new TheiaSplitPanel({ layout: leftRightSplitLayout });

    mainIDEPanel.id = "theia-main-ide-panel";

    return this.createBoxLayout(
      [this.topPanel, mainIDEPanel, this.statusBar],
      [0, 1, 0],
      { direction: "top-to-bottom", spacing: 0 }
    );
  }

  //     const panelForBottomArea = new SplitPanel({
  //         layout: this.createSplitLayout(
  //             [this.mainPanel, this.bottomPanel],
  //             [1, 0],
  //             { orientation: 'vertical', spacing: 0 }
  //         ),
  //     });

  //     panelForBottomArea.id = 'theia-bottom-split-panel';

  //     // Main part (leftPanel, mainPanel, rightPanel)
  //     const editorSplitPanel = new SplitPanel({
  //         layout: this.createSplitLayout(
  //             [this.leftPanelHandler.container, panelForBottomArea, this.rightPanelHandler.container],
  //             [0, 1, 0],
  //             { orientation: 'horizontal', spacing: 0 }
  //         ),
  //     });

  //     editorSplitPanel.id = 'theia-editor-split-panel';

  //     // NOTE For styling purposes
  //     this.codeIdeWidget = new BoxPanel({
  //         layout: this.createBoxLayout([this.topPanel, editorSplitPanel, this.statusBar], [0, 1, 0], { spacing: 0 }),
  //     });

  //     this.codeIdeWidget.node.classList.add('theia-main-ide-inner');

  //     this.mainIdeContainer = new BoxPanel({
  //         layout: this.createBoxLayout([this.codeIdeWidget], [1], { spacing: 0 }),
  //     });

  //     this.mainIdeContainer.id = 'theia-main-ide-panel';
  //     this.mainIdeContainer.node.classList.add('theia-main-ide-panel');

  //     return this.createBoxLayout([this.mainIdeContainer], [1], { spacing: 0 });
  // }

  /**
   * Create an object that describes the current shell layout. This object may contain references
   * to widgets; these need to be transformed before the layout can be serialized.
   */
  // override getLayoutData(): TheiaApplicationShell.LayoutData {
  //     return super.getLayoutData();
  // }

  /**
   * Apply a shell layout that has been previously created with `getLayoutData`.
   */
  // override async setLayoutData(layoutData: TheiaApplicationShell.LayoutData): Promise<void> {
  //     await super.setLayoutData(layoutData);
  // }

  /**
   * Adjusts the size of the given area in the application shell.
   */
  // override resize(size: number, area: ApplicationShellArea): void {
  //     return super.resize(size, area);
  // }

  /**
   * Expand the named side panel area. This makes sure that the panel is visible, even if there
   * are no widgets in it. If the panel is already visible, nothing happens. If the panel is currently
   * collapsed (see `collapsePanel`) and it contains widgets, the widgets are revealed that were
   * visible before it was collapsed.
   */
  // override expandPanel(area: ApplicationShellArea): void {
  //     return super.expandPanel(area);
  // }

  /**
   * Collapse the named side panel area. This makes sure that the panel is hidden,
   * increasing the space that is available for other shell areas.
   */
  // override async collapsePanel(area: ApplicationShellArea): Promise<void> {
  //     return super.collapsePanel(area);
  // }

  // override isExpanded(area: ApplicationShellArea): boolean {
  //     return super.isExpanded(area);
  // }

  // override getCurrentWidget(area: ApplicationShellArea): Widget | undefined {
  //     return super.getCurrentWidget(area);
  // }

  // override getWidgets(area: ApplicationShellArea): Widget[] {
  //     return super.getWidgets(area);
  // }

  // override async addWidget(widget: Widget, options?: Readonly<TheiaApplicationShell.WidgetOptions>): Promise<void> {
  //     return super.addWidget(widget, options);
  // }
}

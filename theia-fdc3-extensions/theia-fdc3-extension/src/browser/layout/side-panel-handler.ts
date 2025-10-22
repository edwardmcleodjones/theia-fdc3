import '@/frontend/style/side-panel.less';

import { BoxLayout, BoxPanel, Panel, SidePanelHandler as TheiaSidePanelHandler, type SideTabBar } from '@theia/core/lib/browser';
import { injectable } from '@theia/core/shared/inversify';

/**
 * Move side panel to top
 */
@injectable()
export class SidePanelHandler extends TheiaSidePanelHandler {
    protected override createSideBar(): SideTabBar {
        const sideBar = super.createSideBar();

        // Dont allow to move icons
        sideBar.tabsMovable = false;

        sideBar.removeClass('theia-app-left');
        sideBar.removeClass('theia-app-right');
        sideBar.addClass('theia-app-top');

        return sideBar;
    }

    protected override createContainer(): Panel {
        this.tabBar.orientation = 'horizontal';

        const side = this.side;

        // flexbox column layout
        const sidePanelLayout = new BoxLayout({ direction: 'top-to-bottom', spacing: 0 });
        // widget:container > layout:sidePanelLayout > [widget:headerPanel, widget:toolBar, widget:dockPanel]
        const container = new BoxPanel({ layout: sidePanelLayout });
        // Panel with burger, tabs, settings icons
        const headerPanel = new Panel();

        BoxPanel.setStretch(headerPanel, 0); // Fixed width for burger icon
        sidePanelLayout.addWidget(headerPanel);

        // Widget title with buttons (like Files [new] [collapse])
        BoxPanel.setStretch(this.toolBar, 0);
        sidePanelLayout.addWidget(this.toolBar);

        // Widget container (like Navigator, Search, ...)
        BoxPanel.setStretch(this.dockPanel, 1); // Stretch dock panel
        sidePanelLayout.addWidget(this.dockPanel);

        // Navigator, Search, ...
        BoxPanel.setStretch(this.tabBar, 1); // Stretch tabs
        headerPanel.addWidget(this.tabBar);

        // Menu burger icon
        BoxPanel.setStretch(this.topMenu, 0); // Fixed width for burger icon
        headerPanel.addWidget(this.topMenu);

        headerPanel.addClass('theia-header-panel');
        container.id = `theia-${ side }-content-panel`;

        return container;
    }

    // Disable collapse
    override async collapse(): Promise<void> {}
}

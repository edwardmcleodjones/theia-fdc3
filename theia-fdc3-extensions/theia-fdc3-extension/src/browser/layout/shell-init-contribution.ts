import {
    DefaultFrontendApplicationContribution
} from '@theia/core/lib/browser';
import { FrontendApplicationStateService } from '@theia/core/lib/browser/frontend-application-state';
import { inject, injectable } from '@theia/core/shared/inversify';
import { FileNavigatorContribution } from '@theia/navigator/lib/browser/navigator-contribution';
import { OutputContribution } from '@theia/output/lib/browser/output-contribution';
import { SearchInWorkspaceFrontendContribution } from '@theia/search-in-workspace/lib/browser/search-in-workspace-frontend-contribution';

@injectable()
export class ShellInitContribution extends DefaultFrontendApplicationContribution {
    @inject(FileNavigatorContribution)
    protected readonly navigatorContribution: FileNavigatorContribution;

    @inject(SearchInWorkspaceFrontendContribution)
    protected readonly searchContribution: SearchInWorkspaceFrontendContribution;

    @inject(OutputContribution)
    protected readonly outputContribution: OutputContribution;

    @inject(FrontendApplicationStateService)
    protected readonly appStateService: FrontendApplicationStateService;

    async onDidInitializeLayout(): Promise<void> {
        await this.openDefaultLayout();
    }

    async onStart(): Promise<void> {
        this.appStateService.onStateChanged((state) => {
            if (state === 'ready') {
                document.body.classList.add('theia-app-ready');
            }
        });
    }

    /**
     * Open default layout on theia load
     */
    protected async openDefaultLayout(): Promise<void> {
        // Force activate files + search + output (bottom)
        await this.navigatorContribution.openView({
            area: 'left',
            reveal: true,
            rank: 100,
        });

        await this.searchContribution.openView({
            area: 'left',
            reveal: false,
            rank: 200,
        });

        // Reveal output widget
        void this.outputContribution.openView({
            area: 'bottom',
            reveal: true,
        });
    }
}

import { FrontendApplication as TheiaFrontendApplication } from '@theia/core/lib/browser';
import { injectable } from '@theia/core/shared/inversify';

@injectable()
export class FrontendApplication extends TheiaFrontendApplication {
    /**
     * Return a promise to the host element to which the application shell is attached.
     */
    override async getHost(): Promise<HTMLElement> {
        const host = () => document.getElementById('theia-app') || document.body;

        if (host()) {
            return host();
        }

        return new Promise<HTMLElement>(
            resolve => window.addEventListener('load', () => resolve(host()), { once: true })
        );
    }
}

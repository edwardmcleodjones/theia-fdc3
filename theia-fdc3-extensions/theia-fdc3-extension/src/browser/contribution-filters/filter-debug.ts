import { DebugConsoleContribution } from '@theia/debug/lib/browser/console/debug-console-contribution';
import { DebugFrontendApplicationContribution } from '@theia/debug/lib/browser/debug-frontend-application-contribution';

export const filterContributions = [
    DebugFrontendApplicationContribution,
    DebugConsoleContribution,
];

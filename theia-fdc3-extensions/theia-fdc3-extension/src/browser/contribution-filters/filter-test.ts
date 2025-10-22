import { TestOutputViewContribution } from '@theia/test/lib/browser/view/test-output-view-contribution';
import { TestResultViewContribution } from '@theia/test/lib/browser/view/test-result-view-contribution';
import { TestRunViewContribution } from '@theia/test/lib/browser/view/test-run-view-contribution';
import { TestViewContribution } from '@theia/test/lib/browser/view/test-view-contribution';

export const filterContributions = [
    TestViewContribution,
    TestRunViewContribution,
    TestResultViewContribution,
    TestOutputViewContribution,
];

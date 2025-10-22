import { ProcessTaskContribution } from '@theia/task/lib/browser/process/process-task-contribution';
import { TaskFrontendContribution } from '@theia/task/lib/browser/task-frontend-contribution';

export const filterContributions = [
    TaskFrontendContribution,
    ProcessTaskContribution,
];

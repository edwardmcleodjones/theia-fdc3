import { NotebookActionsContribution } from '@theia/notebook/lib/browser/contributions/notebook-actions-contribution';
import { NotebookCellActionContribution } from '@theia/notebook/lib/browser/contributions/notebook-cell-actions-contribution';
import { NotebookColorContribution } from '@theia/notebook/lib/browser/contributions/notebook-color-contribution';
import { NotebookLabelProviderContribution } from '@theia/notebook/lib/browser/contributions/notebook-label-provider-contribution';
import { NotebookOutlineContribution } from '@theia/notebook/lib/browser/contributions/notebook-outline-contribution';
import { NotebookOutputActionContribution } from '@theia/notebook/lib/browser/contributions/notebook-output-action-contribution';
import { NotebookStatusBarContribution } from '@theia/notebook/lib/browser/contributions/notebook-status-bar-contribution';

export const filterContributions = [
    NotebookActionsContribution,
    NotebookCellActionContribution,
    NotebookColorContribution,
    NotebookLabelProviderContribution,
    NotebookOutlineContribution,
    NotebookOutputActionContribution,
    NotebookStatusBarContribution,
];

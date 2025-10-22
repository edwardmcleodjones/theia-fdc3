import { SearchInWorkspaceFrontendContribution } from "@theia/search-in-workspace/lib/browser/search-in-workspace-frontend-contribution";

// Filter out Theia's Search (Search in Workspace) contributions from the UI
export const filterContributions = [SearchInWorkspaceFrontendContribution];

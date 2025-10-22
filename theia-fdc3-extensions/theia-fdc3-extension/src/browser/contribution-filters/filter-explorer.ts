import { FileNavigatorContribution } from "@theia/navigator/lib/browser/navigator-contribution";

// Filter out Theia's Explorer (File Navigator) contributions from the UI
export const filterContributions = [FileNavigatorContribution];

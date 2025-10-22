import {
  ContributionFilterRegistry,
  FilterContribution,
} from "@theia/core/lib/common";
import { injectable, interfaces } from "@theia/core/shared/inversify";

import { filterContributions as debugFilterContributions } from "./filter-debug";
import { filterContributions as hierarchyFilterContributions } from "./filter-hierarchy";
import { filterContributions as notebookFilterContributions } from "./filter-notebook";
import { filterContributions as outlineFilterContributions } from "./filter-outline";
import { filterContributions as scmFilterContributions } from "./filter-scm";
import { filterContributions as tasksFilterContributions } from "./filter-tasks";
import { filterContributions as testFilterContributions } from "./filter-test";
import { filterContributions as searchFilterContributions } from "./filter-search";
import { filterContributions as explorerFilterContributions } from "./filter-explorer";
// import { filterContributions as toolbarFilterContributions } from "./filter-toolbar";
// import { filterContributions as pluginFilterContributions } from "./filter-plugin";
// import { filterContributions as outputFilterContributions } from "./filter-output";
// import { filterContributions as problemsFilterContributions } from "./filter-problems";
// import { filterContributions as windowFilterContributions } from "./filter-window";

// List of contributions to be removed from UI
const filtered = [
  ...debugFilterContributions,
  ...testFilterContributions,
  ...scmFilterContributions,
  ...outlineFilterContributions,
  ...hierarchyFilterContributions,
  ...tasksFilterContributions,
  ...notebookFilterContributions,
  ...searchFilterContributions,
  ...explorerFilterContributions,
  //   ...toolbarFilterContributions, // TODO: Doesn't seem to disable the toolbar contributions?
  //   ...pluginFilterContributions,
  //   ...outputFilterContributions,
  //   ...problemsFilterContributions,
  //   ...windowFilterContributions,
];

@injectable()
export class RemoveFromUIFilterContribution implements FilterContribution {
  registerContributionFilters(registry: ContributionFilterRegistry): void {
    registry.addFilters("*", [
      (contrib) => {
        return !filtered.some((c) => contrib instanceof c);
      },
    ]);
  }
}

export function registerFilters({
  bind,
  rebind,
}: {
  bind: interfaces.Bind;
  rebind: interfaces.Rebind;
}): void {
  bind(FilterContribution)
    .to(RemoveFromUIFilterContribution)
    .inSingletonScope();
}

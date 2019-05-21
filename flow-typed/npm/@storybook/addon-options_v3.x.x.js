// flow-typed signature: 4096abe74fc4ed9934891a18922b22e6
// flow-typed version: 028ef45280/@storybook/addon-options_v3.x.x/flow_>=v0.25.x

declare module '@storybook/addon-options' {
  declare type Options = {
    name?: string,
    url?: string,
    goFullScreen?: boolean,
    showLeftPanel?: boolean, // deprecated, use showStoriesPanel
    showStoriesPanel?: boolean,
    showDownPanel?: boolean, // deprecated; use showAddonPanel
    showAddonPanel?: boolean,
    showSearchBox?: boolean,
    downPanelInRight?: boolean, // deprecated; use addonPanelInRight
    addonPanelInRight?: boolean,
    sortStoriesByKind?: boolean,
    hierarchySeparator?: RegExp | string,
    hierarchyRootSeparator?: RegExp | string,
    selectedAddonPanel?: string,
  };

  declare function setOptions(options: Options): void;
}

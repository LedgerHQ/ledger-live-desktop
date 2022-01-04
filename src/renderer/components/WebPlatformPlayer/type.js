// @flow

export type Manifest = {
  name: string,
  url: URL,
  icon?: string,
};

export type TopBarConfig = {
  shouldDisplayName?: boolean,
  shouldDisplayInfo?: boolean,
  shouldDisplayClose?: boolean,
};

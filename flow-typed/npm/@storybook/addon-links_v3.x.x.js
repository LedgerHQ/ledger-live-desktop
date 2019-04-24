// flow-typed signature: 6228614f4cefdb3846493aaa7a03baac
// flow-typed version: bfd22d4eee/@storybook/addon-links_v3.x.x/flow_>=v0.53.x

declare module '@storybook/addon-links' {
  declare type LinkToFunction = (...args: Array<any>) => string;

  declare module.exports: {
    linkTo<T>(
      book: string | LinkToFunction,
      kind?: string | LinkToFunction
    ): (evt: SyntheticEvent<T>) => void,
    hrefTo(kind: string, story: string): Promise<string>,
  };
}

declare module '@storybook/addon-links/react' {
  declare type Props = {
    kind?: string,
    story?: string,
  };

  declare class LinkTo extends React$Component<Props> {}
  declare module.exports: typeof LinkTo;
}

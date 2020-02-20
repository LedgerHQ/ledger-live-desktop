// flow-typed signature: 744524102647f2da4c8dbea4d6895bc7
// flow-typed version: c6154227d1/fuse.js_v3.x.x/flow_>=v0.104.x

declare module 'fuse.js' {
  declare type FuseOptions = {
    caseSensitive?: boolean,
    includeScore?: boolean,
    includeMatches?: boolean,
    minMatchCharLength?: number,
    shouldSort?: boolean,
    tokenize?: boolean,
    matchAllTokens?: boolean,
    findAllMatches?: boolean,
    id?: string,
    keys?: $ReadOnlyArray<any>,
    location?: number,
    threshold?: number,
    distance?: number,
    maxPatternLength?: number,
    getFn?: (obj: any, path: string) => any,
    sortFn?: (a: any, b: any) => boolean,
    verbose?: boolean,
    tokenSeparator?: RegExp,
    ...
  }
  declare class Fuse<T> {
    constructor(items: $ReadOnlyArray<T>, options?: FuseOptions): Fuse<T>;
    search(pattern: string): Array<T>;
    setCollection<U: $ReadOnlyArray<T>>(list: U): U;
  }
  declare module.exports: typeof Fuse
}

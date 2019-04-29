// flow-typed signature: 5653c58c4f271417b17df2d0820a6505
// flow-typed version: 10647261fc/fuse.js_v3.x.x/flow_>=v0.38.x

declare module "fuse.js" {
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
    tokenSeparator?: RegExp
  };
  declare class Fuse<T> {
    constructor(items: $ReadOnlyArray<T>, options?: FuseOptions): Fuse<T>;
    search(pattern: string): Array<T>;
    setCollection<U: $ReadOnlyArray<T>>(list: U): U;
  }
  declare module.exports: typeof Fuse;
}

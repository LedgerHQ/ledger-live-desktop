// @flow
declare var require: NodeRequire & {
  context: (
    directory: string,
    useSubdirectories: boolean,
    regexp: RegExp,
    mode?: 'sync' | 'eager' | 'weak' | 'lazy' | 'lazy-once',
  ) => any,
}

// flow-typed signature: 4a4ede4f7f12b874598b0b727b9a1c4c
// flow-typed version: f898dad1b0/query-string_v6.x.x/flow_>=v0.104.x

declare module 'query-string' {
  declare type ArrayFormat = 'none' | 'bracket' | 'index' | 'comma'
  declare type ParseOptions = {|
    arrayFormat?: ArrayFormat,
    decode?: boolean,
    sort?: false | <A, B>(A, B) => number,
    parseNumbers?: boolean,
    parseBooleans?: boolean,
  |}

  declare type StringifyOptions = {|
    arrayFormat?: ArrayFormat,
    encode?: boolean,
    strict?: boolean,
    sort?: false | <A, B>(A, B) => number,
    skipNull?: boolean,
  |}

  declare type ObjectParameter = string | number | boolean | null | void;

  declare type ObjectParameters = $ReadOnly<{ [string]: ObjectParameter | $ReadOnlyArray<ObjectParameter>, ... }>

  declare type QueryParameters = { [string]: string | Array<string | number> | null, ... }

  declare type StringifyObjectParameter = {| url: string, query?: QueryParameters |}

  declare module.exports: {
    extract(str: string): string,
    parse(str: string, opts?: ParseOptions): QueryParameters,
    parseUrl(str: string, opts?: ParseOptions): {
      url: string,
      query: QueryParameters,
      ...
    },
    stringify(obj: ObjectParameters, opts?: StringifyOptions): string,
    stringifyUrl(obj: StringifyObjectParameter, opts?: StringifyOptions): string,
    ...
  }
}

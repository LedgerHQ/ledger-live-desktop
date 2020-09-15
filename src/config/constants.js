// @flow
/// DEPRECATED ///

// PLEASE READ:
// do not add new envs here!
// the idea is we want either collocation (put the process.env. in place where you need it)
// otherwise, the env MUST be in live-common (if it's a general concept that can be between mobile/desktop or concerns the logic)

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

// Size

// move it in main process code where it is used. no need to override it by CLI.

// time and delays...

// TODO investigate if it's ever needed, drop it otherwise
export const SHOW_MOCK_HSMWARNINGS = Boolean(process.env.SHOW_MOCK_HSMWARNINGS);

// DROP? I suggest we always warn in __DEV__ mode
export const WARN_LEGACY_COLORS = Boolean(process.env.WARN_LEGACY_COLORS);

// investigate what is this and if we can make it not experimental?
export const EXPERIMENTAL_WS_EXPORT = Boolean(process.env.EXPERIMENTAL_WS_EXPORT);

// Drop the feature unless Ben think we want it back.
export const EXPERIMENTAL_MARKET_INDICATOR_SETTINGS = Boolean(
  process.env.EXPERIMENTAL_MARKET_INDICATOR_SETTINGS,
);

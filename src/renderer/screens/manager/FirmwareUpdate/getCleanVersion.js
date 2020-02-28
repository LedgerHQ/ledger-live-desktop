// @flow
const getCleanVersion = (input: string): string =>
  input.endsWith("-osu") ? input.replace("-osu", "") : input;

export default getCleanVersion;

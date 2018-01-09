// @flow

import Color from 'color'

// eslint-disable-next-line import/prefer-default-export
export const rgba = (c: string, a: number) =>
  Color(c)
    .alpha(a)
    .rgb()
    .toString()

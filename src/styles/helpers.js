// @flow

import Color from 'color'

export const rgba = (c: string, a: number) =>
  Color(c)
    .alpha(a)
    .rgb()
    .toString()

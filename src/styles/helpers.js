// @flow

import React from 'react'
import Color from 'color'
import uniqueId from 'lodash/uniqueId'

import staticPath from 'helpers/staticPath'
import { colors, fontFamilies } from 'styles/theme'

export const rgba = (c: string, a: number) =>
  Color(c)
    .alpha(a)
    .rgb()
    .toString()

export const darken = (c: string, a: number) =>
  Color(c)
    .darken(a)
    .toString()

export const lighten = (c: string, a: number) =>
  Color(c)
    .lighten(a)
    .toString()

export const ff = (v: string) => {
  const [font, type = 'Regular'] = v.split('|')
  const { style, weight } = fontFamilies[font][type]
  const fallback = fontFamilies[font].fallback || 'Arial'

  return {
    fontFamily: `${font}, ${fallback}`,
    fontWeight: weight,
    fontStyle: style,
  }
}

export const fontFace = ({
  name,
  file,
  style,
  weight,
}: {
  name: string,
  file: string,
  style: string,
  weight: number,
}) => `
  @font-face {
    font-family: "${name}";
    src: url("${
      __DEV__ ? '' : staticPath.replace(/\\/g, '/')
    }/fonts/${file}.woff2") format("woff2");
    font-style: ${style};
    font-weight: ${weight};
  }
`

export const multiline = (str: string): React$Node[] =>
  str.split('\n').map(line => <p key={uniqueId()}>{line}</p>)

export function getMarketColor({
  marketIndicator,
  isNegative,
}: {
  marketIndicator: string,
  isNegative: boolean,
}) {
  if (isNegative) {
    return colors[`marketDown_${marketIndicator}`]
  }

  return colors[`marketUp_${marketIndicator}`]
}

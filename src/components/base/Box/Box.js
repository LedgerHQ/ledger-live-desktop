// @flow

import styled from 'styled-components'
import {
  alignItems,
  alignSelf,
  borderRadius,
  boxShadow,
  color,
  flex,
  flexWrap,
  fontSize,
  justifyContent,
  space,
  style,
} from 'styled-system'

import fontFamily from 'styles/styled/fontFamily'

export const styledTextAlign = style({ prop: 'textAlign', cssProperty: 'textAlign' })
export const styledOverflow = style({ prop: 'overflow', cssProperty: 'overflow' })
export const styledCursor = style({ prop: 'cursor', cssProperty: 'cursor' })
export const styledTextTransform = style({ prop: 'textTransform', cssProperty: 'textTransform' })

export default styled.div`
  ${alignItems};
  ${alignSelf};
  ${borderRadius};
  ${boxShadow};
  ${color};
  ${flex};
  ${flexWrap};
  ${fontFamily};
  ${fontSize};
  ${justifyContent};
  ${space};
  ${styledTextAlign};
  ${styledCursor};
  ${styledTextTransform};
  ${styledOverflow};

  display: flex;
  flex-shrink: ${p => (p.noShrink === true ? '0' : p.shrink === true ? '1' : '')};
  flex-grow: ${p => (p.grow === true ? '1' : p.grow || '')};
  flex-direction: ${p => (p.horizontal ? 'row' : 'column')};

  overflow: ${p => p.overflow};
  overflow-y: ${p => (p.scroll === true ? 'auto' : '')};
  position: ${p => (p.relative ? 'relative' : p.sticky ? 'absolute' : '')};

  ${p =>
    p.selectable &&
    `
    user-select: text;
    `};
  right: auto;

  ${p =>
    p.sticky &&
    `
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    `};

  > * + * {
    margin-top: ${p => (!p.horizontal && p.flow ? `${p.theme.space[p.flow]}px` : '')};
    margin-left: ${p => (p.horizontal && p.flow ? `${p.theme.space[p.flow]}px` : '')};
  }
`

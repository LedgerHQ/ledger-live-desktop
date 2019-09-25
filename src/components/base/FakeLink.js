import styled from 'styled-components'
import Box from 'components/base/Box'
import get from 'lodash/get'

import { darken, lighten } from 'styles/helpers'

export default styled(Box).attrs(p => ({
  cursor: 'pointer',
  color: p.color || 'wallet',
  horizontal: true,
}))`
  align-items: center;
  text-decoration: ${p => (p.underline ? 'underline' : 'none')};
  &:hover {
    text-decoration: underline;
    color: ${p =>
      lighten(
        get(p.theme.colors, p.color) || p.color || p.theme.colors.palette.primary.main,
        0.05,
      )};
  }

  &:active {
    color: ${p =>
      darken(get(p.theme.colors, p.color) || p.color || p.theme.colors.palette.primary.main, 0.1)};
  }
`

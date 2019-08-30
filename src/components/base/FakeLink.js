import styled from 'styled-components'
import Box from 'components/base/Box'

import { darken, lighten } from 'styles/helpers'

export default styled(Box).attrs({
  cursor: 'pointer',
  color: p => p.color || 'wallet',
  horizontal: true,
})`
  align-items: center;
  text-decoration: ${p => (p.underline ? 'underline' : 'none')};
  &:hover {
    text-decoration: underline;
    color: ${p => lighten(p.theme.colors[p.color] || p.color || p.theme.colors.wallet, 0.05)};
  }

  &:active {
    color: ${p => darken(p.theme.colors[p.color] || p.color || p.theme.colors.wallet, 0.1)};
  }
`

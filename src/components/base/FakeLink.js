import styled from 'styled-components'
import Box from 'components/base/Box'

import { darken, lighten } from 'styles/helpers'

export default styled(Box).attrs({
  cursor: 'pointer',
  color: 'wallet',
})`
  &:hover {
    text-decoration: underline;
    color: ${p => lighten(p.theme.colors.wallet, 0.05)};
  }

  &:active {
    color: ${p => darken(p.theme.colors.wallet, 0.1)};
  }
`

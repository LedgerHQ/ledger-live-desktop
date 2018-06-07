// @flow

import styled from 'styled-components'

import { rgba } from 'styles/helpers'

import { Tabbable } from 'components/base/Box'

export default styled(Tabbable).attrs({
  px: 3,
  ml: 0,
  alignItems: 'center',
  cursor: p => (p.isDisabled ? 'default' : 'pointer'),
  horizontal: true,
})`
  min-height: 40px;
  border: 1px dashed transparent;

  &:hover {
    color: ${p => (p.isDisabled ? '' : p.theme.colors.wallet)};
    background: ${p => (p.isDisabled ? '' : rgba(p.theme.colors.wallet, 0.05))};
  }

  &:active {
    background: ${p => (p.isDisabled ? '' : rgba(p.theme.colors.wallet, 0.1))};
  }

  &:focus {
    outline: none;
  }
`

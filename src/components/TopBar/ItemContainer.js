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
  borderRadius: 1,
})`
  height: 40px;
  border: 1px dashed transparent;

  &:hover {
    color: ${p => (p.isDisabled ? '' : p.theme.colors.dark)};
    background: ${p => (p.isDisabled ? '' : rgba(p.theme.colors.fog, 0.2))};
  }

  &:active {
    background: ${p => (p.isDisabled ? '' : rgba(p.theme.colors.fog, 0.3))};
  }

  &:focus {
    outline: none;
  }
`

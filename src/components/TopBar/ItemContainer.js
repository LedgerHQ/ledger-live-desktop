// @flow

import styled from 'styled-components'

import { rgba } from 'styles/helpers'

import { Tabbable } from 'components/base/Box'

export default styled(Tabbable).attrs({
  px: 3,
  ml: 0,
  alignItems: 'center',
  cursor: p => (p.disabled ? 'not-allowed' : 'default'),
  horizontal: true,
  borderRadius: 1,
})`
  -webkit-app-region: no-drag;
  height: 40px;
  pointer-events: ${p => (p.disabled ? 'none' : 'unset')};

  &:hover {
    color: ${p => (p.disabled ? '' : p.theme.colors.dark)};
    background: ${p => (p.disabled ? '' : rgba(p.theme.colors.fog, 0.2))};
  }

  &:active {
    background: ${p => (p.disabled ? '' : rgba(p.theme.colors.fog, 0.3))};
  }
`

// @flow

import styled from 'styled-components'

import { rgba } from 'styles/helpers'

import { Tabbable } from 'components/base/Box'

export default styled(Tabbable).attrs(p => ({
  px: 3,
  ml: 0,
  alignItems: 'center',
  cursor: p.disabled ? 'not-allowed' : 'default',
  horizontal: true,
  borderRadius: 1,
}))`
  -webkit-app-region: no-drag;
  height: 40px;
  pointer-events: ${p => (p.disabled ? 'none' : 'unset')};

  &:hover {
    color: ${p => (p.disabled ? '' : p.theme.colors.palette.text.shade100)};
    background: ${p => (p.disabled ? '' : rgba(p.theme.colors.palette.action.active, 0.05))};
  }

  &:active {
    background: ${p => (p.disabled ? '' : rgba(p.theme.colors.palette.action.active, 0.1))};
  }
`

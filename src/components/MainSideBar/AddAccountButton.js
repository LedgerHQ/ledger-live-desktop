// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'

import { Tabbable } from 'components/base/Box'
import Tooltip from 'components/base/Tooltip'
import IconCirclePlus from 'icons/CirclePlus'

import { rgba } from 'styles/helpers'

const PlusWrapper = styled(Tabbable).attrs(() => ({
  p: 1,
  borderRadius: 1,
}))`
  color: ${p => p.theme.colors.palette.text.shade80};
  &:hover {
    color: ${p => p.theme.colors.palette.text.shade100};
  }

  &:focus {
    outline: none;
    border-color: ${p => rgba(p.theme.colors.wallet, 0.3)};
  }
`

export default class AddAccountButton extends PureComponent<{
  onClick: () => void,
  tooltipText: string,
}> {
  render() {
    const { onClick, tooltipText } = this.props
    return (
      <Tooltip content={tooltipText}>
        <PlusWrapper onClick={onClick}>
          <IconCirclePlus size={16} data-e2e="menuAddAccount_button" />
        </PlusWrapper>
      </Tooltip>
    )
  }
}

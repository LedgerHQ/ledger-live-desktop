// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'

import { Tabbable } from 'components/base/Box'
import Tooltip from 'components/base/Tooltip'
import IconCirclePlus from 'icons/CirclePlus'

import { rgba } from 'styles/helpers'

const PlusWrapper = styled(Tabbable).attrs({
  p: 1,
  borderRadius: 1,
})`
  color: ${p => p.theme.colors.smoke};
  &:hover {
    color: ${p => p.theme.colors.dark};
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
      <Tooltip render={() => tooltipText}>
        <PlusWrapper onClick={onClick}>
          <IconCirclePlus size={16} />
        </PlusWrapper>
      </Tooltip>
    )
  }
}

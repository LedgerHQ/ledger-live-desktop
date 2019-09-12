// @flow

import React from 'react'

import Tooltip from 'components/base/Tooltip'

type Props = {
  children: React$Node,
  enabled: boolean,
  text: React$Node,
}

const tippyOptions = {
  placement: 'right',
  boundary: 'window',
  popperOptions: {
    modifiers: {
      preventOverflow: {
        enabled: false,
      },
    },
  },
}

const SideBarTooltip = ({ children, text, enabled }: Props) => (
  <Tooltip options={tippyOptions} render={() => text} enabled={enabled}>
    {children}
  </Tooltip>
)

export default React.memo<Props>(SideBarTooltip)

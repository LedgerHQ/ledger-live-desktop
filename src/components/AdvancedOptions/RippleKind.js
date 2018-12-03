// @flow
import React, { Component } from 'react'
import { BigNumber } from 'bignumber.js'
import { translate } from 'react-i18next'

import Box from 'components/base/Box'
import Input from 'components/base/Input'
import Label from 'components/base/Label'

type Props = {
  tag: ?number,
  onChangeTag: (?number) => void,
  t: *,
}

const uint32maxPlus1 = BigNumber(2).pow(32)

class RippleKind extends Component<Props> {
  onChange = str => {
    const { onChangeTag } = this.props
    const tag = BigNumber(str.replace(/[^0-9]/g, ''))
    if (!tag.isNaN() && tag.isFinite()) {
      if (tag.isInteger() && tag.isPositive() && tag.lt(uint32maxPlus1)) {
        onChangeTag(tag.toNumber())
      }
    } else {
      onChangeTag(undefined)
    }
  }
  render() {
    const { tag, t } = this.props
    return (
      <Box vertical flow={5}>
        <Box grow>
          <Label>
            <span>{t('send.steps.amount.rippleTag')}</span>
          </Label>
          <Input value={String(tag || '')} onChange={this.onChange} />
        </Box>
      </Box>
    )
  }
}

export default translate()(RippleKind)

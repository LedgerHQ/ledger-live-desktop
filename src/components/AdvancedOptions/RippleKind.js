// @flow
import React, { Component } from 'react'
import { BigNumber } from 'bignumber.js'
import { translate } from 'react-i18next'

import Box from 'components/base/Box'
import Input from 'components/base/Input'
import Label from 'components/base/Label'
import Spoiler from 'components/base/Spoiler'

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
      <Spoiler title={t('app:send.steps.amount.advancedOptions')}>
        <Box horizontal align="center" flow={5}>
          <Box style={{ width: 200 }}>
            <Label>
              <span>{t('app:send.steps.amount.rippleTag')}</span>
            </Label>
          </Box>
          <Box grow>
            <Input value={String(tag || '')} onChange={this.onChange} />
          </Box>
        </Box>
      </Spoiler>
    )
  }
}

export default translate()(RippleKind)

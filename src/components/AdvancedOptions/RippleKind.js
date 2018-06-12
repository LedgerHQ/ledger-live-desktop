// @flow
import React from 'react'
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

export default translate()(({ tag, onChangeTag, t }: Props) => (
  <Spoiler title="Advanced options">
    <Box horizontal align="center" flow={5}>
      <Box style={{ width: 200 }}>
        <Label>
          <span>{t('app:send.steps.amount.rippleTag')}</span>
        </Label>
      </Box>
      <Box grow>
        <Input
          value={String(tag || '')}
          onChange={str => {
            const tag = parseInt(str, 10)
            if (!isNaN(tag) && isFinite(tag)) onChangeTag(tag)
            else onChangeTag(undefined)
          }}
        />
      </Box>
    </Box>
  </Spoiler>
))

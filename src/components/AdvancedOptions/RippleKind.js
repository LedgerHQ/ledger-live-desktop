// @flow
import React from 'react'
import { translate } from 'react-i18next'

import Box from 'components/base/Box'
import Input from 'components/base/Input'
import Label from 'components/base/Label'

type Props = {
  tag: ?number,
  onChangeTag: (?number) => void,
  t: *,
}

export default translate()(({ tag, onChangeTag, t }: Props) => (
  <Box vertical flow={5}>
    <Box grow>
      <Label>
        <span>{t('app:send.steps.amount.rippleTag')}</span>
      </Label>
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
))

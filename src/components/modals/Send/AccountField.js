// @flow
import React from 'react'
import Box from 'components/base/Box'
import Label from 'components/base/Label'
import SelectAccount from 'components/SelectAccount'

const AccountField = ({ onChange, value, t }: *) => (
  <Box flow={1}>
    <Label>{t('app:send.steps.amount.selectAccountDebit')}</Label>
    <SelectAccount onChange={onChange} value={value} />
  </Box>
)

export default AccountField

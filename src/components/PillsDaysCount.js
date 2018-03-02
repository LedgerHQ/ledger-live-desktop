// @flow

import React from 'react'
import { translate } from 'react-i18next'

import type { T } from 'types/common'

import Pills from 'components/base/Pills'

type Props = {
  selectedTime: string,
  onChange: Function,
  t: T,
}

const itemsTimes = [
  { key: 'week', value: 7 },
  { key: 'month', value: 30 },
  { key: 'year', value: 365 },
]

function PillsDaysCount(props: Props) {
  const { selectedTime, onChange, t } = props
  return (
    <Pills
      items={itemsTimes.map(item => ({
        ...item,
        label: t(`time:${item.key}`),
      }))}
      activeKey={selectedTime}
      onChange={onChange}
    />
  )
}

export default translate()(PillsDaysCount)

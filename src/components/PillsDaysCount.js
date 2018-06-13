// @flow

import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'

import type { T } from 'types/common'

import Pills from 'components/base/Pills'

type Props = {
  selectedTime: string,
  onChange: ({ key: string, value: *, label: string }) => void,
  t: T,
}

const itemsTimes = [
  { key: 'week', value: 7 },
  { key: 'month', value: 30 },
  { key: 'year', value: 365 },
]

class PillsDaysCount extends PureComponent<Props> {
  render() {
    const { selectedTime, onChange, t } = this.props
    return (
      <Pills
        items={itemsTimes.map(item => ({
          ...item,
          label: t(`app:time.${item.key}`),
        }))}
        activeKey={selectedTime}
        onChange={onChange}
      />
    )
  }
}

export default translate()(PillsDaysCount)

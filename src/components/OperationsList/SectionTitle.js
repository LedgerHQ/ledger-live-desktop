// @flow

import React, { PureComponent } from 'react'
import moment from 'moment'
import Box from 'components/base/Box'

const calendarOpts = {
  sameDay: 'LL – [Today]',
  nextDay: 'LL – [Tomorrow]',
  lastDay: 'LL – [Yesterday]',
  lastWeek: 'LL',
  sameElse: 'LL',
}

type Props = {
  day: Date,
}

export class SectionTitle extends PureComponent<Props> {
  render() {
    const { day } = this.props
    const d = moment(day)
    return (
      <Box ff="Inter|SemiBold" fontSize={4} color="palette.text.shade60">
        {d.calendar(null, calendarOpts)}
      </Box>
    )
  }
}

export default SectionTitle

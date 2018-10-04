// @flow

import React, { PureComponent } from 'react'
import moment from 'moment'
import { translate } from 'react-i18next'
import type { T } from 'types/common'
import Box from './base/Box'

class SyncAgo extends PureComponent<{ t: T, date: Date }> {
  render() {
    const { t, date } = this.props
    return <Box p={4}>{t('common.sync.ago', { time: moment(date).fromNow() })}</Box>
  }
}

export default translate()(SyncAgo)

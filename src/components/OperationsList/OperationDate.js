// @flow
import React, { PureComponent } from 'react'
import styled from 'styled-components'
import moment from 'moment'
import Text from 'components/base/Text'

const Hour = styled(Text).attrs(() => ({
  color: 'palette.text.shade60',
  fontSize: 3,
  ff: 'Inter',
}))`
  letter-spacing: 0.3px;
  text-transform: uppercase;
`

export default class OperationDate extends PureComponent<{ date: Date }> {
  render() {
    const { date } = this.props
    return <Hour>{moment(date).format('HH:mm')}</Hour>
  }
}

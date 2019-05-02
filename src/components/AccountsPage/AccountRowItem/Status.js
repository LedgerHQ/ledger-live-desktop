// @flow

import React, { Component } from 'react'
import Box from 'components/base/Box'
import IconCheck from 'icons/Check'

class Status extends Component<*> {
  render() {
    return (
      <Box {...this.props}>
        <IconCheck size={16} />
      </Box>
    )
  }
}

export default Status

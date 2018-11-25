// @flow

/* eslint-disable react/jsx-no-literals */

import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'
import Box, { Card } from 'components/base/Box'

class TabProfile extends PureComponent<*, *> {
  render() {
    return (
      <Card flow={3}>
        <Box horizontal>Nothing here</Box>
      </Card>
    )
  }
}

export default translate()(TabProfile)

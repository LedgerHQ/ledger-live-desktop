// @flow

import React from 'react'
import { Route } from 'react-router'

import Box from 'components/base/Box'
import SideBar from 'components/SideBar'
import TopBar from 'components/TopBar'
import Home from 'components/Home'

export default () => (
  <Box grow horizontal>
    <SideBar />
    <Box grow bg="cream">
      <TopBar />
      <Route path="/" component={Home} />
    </Box>
  </Box>
)

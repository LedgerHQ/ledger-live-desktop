// @flow

import React from 'react'
import { Route } from 'react-router'
import { translate } from 'react-i18next'

import Box from 'components/base/Box'

import Home from 'components/Home'
import SideBar from 'components/SideBar'
import TopBar from 'components/TopBar'

const Wrapper = () => (
  <Box grow horizontal>
    <SideBar />
    <Box grow bg="cream">
      <TopBar />
      <Route path="/" component={Home} />
    </Box>
  </Box>
)

export default translate()(Wrapper)

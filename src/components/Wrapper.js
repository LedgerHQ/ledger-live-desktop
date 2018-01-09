// @flow

import React, { Fragment } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Route } from 'react-router'
import { translate } from 'react-i18next'

import Box from 'components/base/Box'
import Overlay from 'components/base/Overlay'

import Home from 'components/Home'
import SideBar from 'components/SideBar'
import TopBar from 'components/TopBar'

const Wrapper = ({ devices, t }: { devices: Array<Object>, t: string => string }) => (
  <Fragment>
    {devices.length === 0 ? (
      <Overlay align="center" justify="center">
        <Box color="white">{t('common.connectDevise')}</Box>
      </Overlay>
    ) : (
      <Box grow horizontal>
        <SideBar />
        <Box grow bg="cream">
          <TopBar />
          <Route path="/" component={Home} />
        </Box>
      </Box>
    )}
  </Fragment>
)

export default compose(connect(({ devices }): Object => ({ devices })), translate())(Wrapper)

// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { translate } from 'react-i18next'
import { compose } from 'redux'
import { listCurrencies } from '@ledgerhq/currencies'

import type { Currency } from '@ledgerhq/currencies'
import type { Device } from 'types/common'

import { runJob } from 'renderer/events'
import { getCurrentDevice } from 'reducers/devices'

import DeviceMonit from 'components/DeviceMonit'
import Box from 'components/base/Box'
import Modal, { ModalBody } from 'components/base/Modal'

import ManagerApp from './ManagerApp'

const CURRENCIES = listCurrencies()

const List = styled(Box).attrs({
  horizontal: true,
  m: -1,
})`
  flex-wrap: wrap;
`

const mapStateToProps = state => ({
  device: getCurrentDevice(state),
})

type Props = {
  device: Device,
}

type Status = 'idle' | 'busy' | 'success' | 'error'

type State = {
  status: Status,
  error: string | null,
}

class ManagerPage extends PureComponent<Props, State> {
  state = {
    status: 'idle',
    error: null,
  }

  createDeviceJobHandler = options => (currency: Currency) => async () => {
    this.setState({ status: 'busy' })
    try {
      const { job, successResponse, errorResponse } = options
      const { device: { path: devicePath } } = this.props
      const data = { appName: currency.name.toLowerCase(), devicePath }
      await runJob({ channel: 'usb', job, successResponse, errorResponse, data })
      this.setState({ status: 'success' })
    } catch (err) {
      this.setState({ status: 'error', error: err.message })
    }
  }

  handleInstall = this.createDeviceJobHandler({
    job: 'manager.installApp',
    successResponse: 'device.appInstalled',
    errorResponse: 'device.appInstallError',
  })

  handleUninstall = this.createDeviceJobHandler({
    job: 'manager.uninstallApp',
    successResponse: 'device.appUninstalled',
    errorResponse: 'device.appUninstallError',
  })

  handleCloseModal = () => this.setState({ status: 'idle' })

  renderList = () => (
    <List>
      {CURRENCIES.map(c => (
        <ManagerApp
          key={c.coinType}
          currency={c}
          onInstall={this.handleInstall(c)}
          onUninstall={this.handleUninstall(c)}
        />
      ))}
    </List>
  )

  render() {
    const { status, error } = this.state
    return (
      <DeviceMonit
        render={deviceStatus => (
          <Box>
            {deviceStatus === 'unconnected' && (
              <Box style={{ height: 500 }} align="center" justify="center">
                <Box fontSize={8}>{'Connect your device'}</Box>
              </Box>
            )}
            {deviceStatus === 'connected' && this.renderList()}
            <Modal
              isOpened={status !== 'idle'}
              render={() => (
                <ModalBody p={6} align="center" justify="center" style={{ height: 300 }}>
                  {status === 'busy' ? (
                    <Box>{'Loading...'}</Box>
                  ) : status === 'error' ? (
                    <Box>
                      <div>{'error happened'}</div>
                      {error}
                      <button onClick={this.handleCloseModal}>close</button>
                    </Box>
                  ) : status === 'success' ? (
                    <Box>
                      {'success'}
                      <button onClick={this.handleCloseModal}>close</button>
                    </Box>
                  ) : null}
                </ModalBody>
              )}
            />
          </Box>
        )}
      />
    )
  }
}

export default compose(translate(), connect(mapStateToProps))(ManagerPage)

// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'

import { runJob } from 'renderer/events'

import Box from 'components/base/Box'
import Modal, { ModalBody } from 'components/base/Modal'

import type { Device } from 'types/common'

import ManagerApp from './ManagerApp'

const List = styled(Box).attrs({
  horizontal: true,
  m: -2,
})`
  flex-wrap: wrap;
`

let CACHED_APPS = null

const ICONS_FALLBACK = {
  bitcoin_testnet: 'bitcoin',
}

type Status = 'loading' | 'idle' | 'busy' | 'success' | 'error'

type jobHandlerOptions = {
  job: string,
  successResponse: string,
  errorResponse: string,
}

type LedgerApp = {
  name: string,
  icon: string,
  app: Object,
}

type Props = {
  device: Device,
}

type State = {
  status: Status,
  error: string | null,
  appsList: LedgerApp[],
}

class AppsList extends PureComponent<Props, State> {
  state = {
    status: 'loading',
    error: null,
    appsList: [],
  }

  componentDidMount() {
    this.fetchList()
  }

  componentWillUnmount() {
    this._unmounted = true
  }

  _unmounted = false

  async fetchList() {
    const appsList =
      CACHED_APPS ||
      (await runJob({
        channel: 'usb',
        job: 'manager.listApps',
        successResponse: 'manager.listAppsSuccess',
        errorResponse: 'manager.listAppsError',
      }))
    CACHED_APPS = appsList
    if (!this._unmounted) {
      this.setState({ appsList, status: 'idle' })
    }
  }

  createDeviceJobHandler = (options: jobHandlerOptions) => (args: { app: any }) => async () => {
    const appParams = args.app
    this.setState({ status: 'busy' })
    try {
      const { job, successResponse, errorResponse } = options
      const { device: { path: devicePath } } = this.props
      const data = { appParams, devicePath }
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

  render() {
    const { status, error } = this.state
    return (
      <List>
        {this.state.appsList.map(c => (
          <ManagerApp
            key={c.name}
            name={c.name}
            icon={ICONS_FALLBACK[c.icon] || c.icon}
            onInstall={this.handleInstall(c)}
            onUninstall={this.handleUninstall(c)}
          />
        ))}
        <Modal
          isOpened={status !== 'idle' && status !== 'loading'}
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
      </List>
    )
  }
}

export default AppsList

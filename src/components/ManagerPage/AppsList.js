// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { translate } from 'react-i18next'

import listApps from 'commands/listApps'
import installApp from 'commands/installApp'

import Box from 'components/base/Box'
import Modal, { ModalBody } from 'components/base/Modal'

import type { Device, T } from 'types/common'

import ManagerApp from './ManagerApp'

const List = styled(Box).attrs({
  horizontal: true,
  m: -3,
})`
  flex-wrap: wrap;
`

let CACHED_APPS = null

const ICONS_FALLBACK = {
  bitcoin_testnet: 'bitcoin',
}

type Status = 'loading' | 'idle' | 'busy' | 'success' | 'error'

type LedgerApp = {
  name: string,
  version: string,
  icon: string,
  app: Object,
  bolos_version: {
    min: number,
    max: number,
  },
}

type Props = {
  device: Device,
  t: T,
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
    this.fetchAppList()
  }

  componentWillUnmount() {
    this._unmounted = true
  }

  _unmounted = false

  async fetchAppList() {
    try {
      const {
        device: { path: devicePath },
      } = this.props
      const appsList = CACHED_APPS || (await listApps.send({ devicePath }).toPromise())
      CACHED_APPS = appsList
      if (!this._unmounted) {
        this.setState({ appsList, status: 'idle' })
      }
    } catch (err) {
      this.setState({ status: 'error', error: err.message })
    }
  }

  handleInstallApp = (args: { app: any }) => async () => {
    const appParams = args.app
    this.setState({ status: 'busy' })
    try {
      const {
        device: { path: devicePath },
      } = this.props
      const data = { appParams, devicePath }
      await installApp.send(data).toPromise()
      this.setState({ status: 'success' })
    } catch (err) {
      this.setState({ status: 'error', error: err.message })
    }
  }

  handleUninstallApp = (/* args: { app: any } */) => () => {
    /* TODO */
  }

  handleCloseModal = () => this.setState({ status: 'idle' })

  renderList() {
    const { status, error } = this.state
    return (
      <List>
        {this.state.appsList.map(c => (
          <ManagerApp
            key={`${c.name}_${c.version}_${c.bolos_version.min}`}
            name={c.name}
            version={`Version ${c.version}`}
            icon={ICONS_FALLBACK[c.icon] || c.icon}
            onInstall={this.handleInstallApp(c)}
            onUninstall={this.handleUninstallApp()}
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

  render() {
    const { t } = this.props
    return (
      <Box flow={6}>
        <Box>
          <Box mb={4} color="dark" ff="Museo Sans" fontSize={6}>
            {t('manager:allApps')}
          </Box>
          {this.renderList()}
        </Box>
      </Box>
    )
  }
}

export default translate()(AppsList)

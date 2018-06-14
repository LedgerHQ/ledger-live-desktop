// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { translate } from 'react-i18next'

import type { Device, T } from 'types/common'

import listApps from 'commands/listApps'
import installApp from 'commands/installApp'
import uninstallApp from 'commands/uninstallApp'

import Box from 'components/base/Box'
import Modal, { ModalBody } from 'components/base/Modal'
import Tooltip from 'components/base/Tooltip'
import Text from 'components/base/Text'
import Progress from 'components/base/Progress'
import Spinner from 'components/base/Spinner'

import ExclamationCircle from 'icons/ExclamationCircle'
import Update from 'icons/Update'
import Trash from 'icons/Trash'
import CheckCircle from 'icons/CheckCircle'

import ManagerApp from './ManagerApp'
import AppSearchBar from './AppSearchBar'

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
type Mode = '' | 'installing' | 'uninstalling'

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
  targetId: string | number,
  t: T,
}

type State = {
  status: Status,
  error: string | null,
  appsList: LedgerApp[],
  app: string,
  mode: Mode,
}

class AppsList extends PureComponent<Props, State> {
  state = {
    status: 'loading',
    error: null,
    appsList: [],
    app: '',
    mode: '',
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
      const { targetId } = this.props
      const appsList = CACHED_APPS || (await listApps.send({ targetId }).toPromise())
      CACHED_APPS = appsList
      if (!this._unmounted) {
        this.setState({ appsList, status: 'idle' })
      }
    } catch (err) {
      this.setState({ status: 'error', error: err.message })
    }
  }

  handleInstallApp = (args: { app: any, name: string }) => async () => {
    const { app: appParams, name } = args
    this.setState({ status: 'busy', app: name, mode: 'installing' })
    try {
      const {
        device: { path: devicePath },
      } = this.props
      const data = { appParams, devicePath }
      await installApp.send(data).toPromise()
      this.setState({ status: 'success', app: '' })
    } catch (err) {
      this.setState({ status: 'error', error: err.message, app: '', mode: '' })
    }
  }

  handleUninstallApp = (args: { app: any, name: string }) => async () => {
    const { app: appParams, name } = args
    this.setState({ status: 'busy', app: name, mode: 'uninstalling' })
    try {
      const {
        device: { path: devicePath },
      } = this.props
      const data = { appParams, devicePath }
      await uninstallApp.send(data).toPromise()
      this.setState({ status: 'success', app: '' })
    } catch (err) {
      this.setState({ status: 'error', error: err.message, app: '', mode: '' })
    }
  }

  handleCloseModal = () => this.setState({ status: 'idle', mode: '' })

  renderModal = () => {
    const { t } = this.props
    const { app, status, error, mode } = this.state

    return (
      <Modal
        isOpened={status !== 'idle' && status !== 'loading'}
        render={() => (
          <ModalBody p={6} align="center" justify="center" style={{ height: 300 }}>
            {status === 'busy' || status === 'idle' ? (
              <Box align="center" justify="center" flow={3}>
                {mode === 'installing' ? <Update size={30} /> : <Trash size={30} />}
                <Text ff="Museo Sans|Regular" fontSize={6} color="dark">
                  {t(`app:manager.apps.${mode}`, { app })}
                </Text>
                <Box my={5} style={{ width: 250 }}>
                  <Progress style={{ width: '100%' }} infinite />
                </Box>
              </Box>
            ) : status === 'error' ? (
              <Box align="center" justify="center" flow={3}>
                <div>{'error happened'}</div>
                {error}
                <button onClick={this.handleCloseModal}>close</button>
              </Box>
            ) : status === 'success' ? (
              <Box align="center" justify="center" flow={3}>
                <Box color="positiveGreen">
                  <CheckCircle size={30} />
                </Box>
                <Text ff="Museo Sans|Regular" fontSize={6} color="dark">
                  {t(
                    `app:manager.apps.${
                      mode === 'installing' ? 'installSuccess' : 'uninstallSuccess'
                    }`,
                    { app },
                  )}
                </Text>
                <button onClick={this.handleCloseModal}>close</button>
              </Box>
            ) : null}
          </ModalBody>
        )}
      />
    )
  }

  renderList() {
    const { appsList } = this.state
    return appsList.length > 0 ? (
      <Box>
        <AppSearchBar list={appsList}>
          {items => (
            <List>
              {items.map(c => (
                <ManagerApp
                  key={`${c.name}_${c.version}_${c.bolos_version.min}`}
                  name={c.name}
                  version={`Version ${c.version}`}
                  icon={ICONS_FALLBACK[c.icon] || c.icon}
                  onInstall={this.handleInstallApp(c)}
                  onUninstall={this.handleUninstallApp(c)}
                />
              ))}
            </List>
          )}
        </AppSearchBar>
        {this.renderModal()}
      </Box>
    ) : (
      <Box align="center" justify="center">
        <Spinner size={50} />
      </Box>
    )
  }

  render() {
    const { t } = this.props
    return (
      <Box flow={6}>
        <Box>
          <Box mb={4} color="dark" ff="Museo Sans" fontSize={5} flow={2} horizontal>
            <span>{t('app:manager.apps.all')}</span>
            <span>
              <Tooltip
                render={() => (
                  <Box ff="Open Sans|SemiBold" fontSize={2}>
                    {t('app:manager.apps.help')}
                  </Box>
                )}
              >
                <ExclamationCircle size={12} />
              </Tooltip>
            </span>
          </Box>
          {this.renderList()}
        </Box>
      </Box>
    )
  }
}

export default translate()(AppsList)

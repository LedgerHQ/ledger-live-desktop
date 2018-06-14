// @flow
/* eslint-disable react/jsx-no-literals */ // FIXME

import React, { PureComponent, Fragment } from 'react'
import styled from 'styled-components'
import { translate } from 'react-i18next'

import type { Device, T } from 'types/common'
import type { LedgerScriptParams } from 'helpers/common'

import listApps from 'commands/listApps'
import installApp from 'commands/installApp'
import uninstallApp from 'commands/uninstallApp'

import Box from 'components/base/Box'
import Modal, { ModalBody, ModalFooter, ModalTitle, ModalContent } from 'components/base/Modal'
import Tooltip from 'components/base/Tooltip'
import Text from 'components/base/Text'
import Progress from 'components/base/Progress'
import Spinner from 'components/base/Spinner'
import Button from 'components/base/Button'
import Space from 'components/base/Space'

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
type Mode = 'home' | 'installing' | 'uninstalling'

type Props = {
  device: Device,
  targetId: string | number,
  t: T,
  version: string,
}

type State = {
  status: Status,
  error: string | null,
  appsList: LedgerScriptParams[] | Array<*>,
  app: string,
  mode: Mode,
}

class AppsList extends PureComponent<Props, State> {
  state = {
    status: 'loading',
    error: null,
    appsList: [],
    app: '',
    mode: 'home',
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
      const { targetId, version } = this.props
      const appsList = CACHED_APPS || (await listApps.send({ targetId, version }).toPromise())
      CACHED_APPS = appsList
      if (!this._unmounted) {
        this.setState({ appsList, status: 'idle' })
      }
    } catch (err) {
      this.setState({ status: 'error', error: err.message })
    }
  }

  handleInstallApp = (app: LedgerScriptParams) => async () => {
    this.setState({ status: 'busy', app: app.name, mode: 'installing' })
    try {
      const {
        device: { path: devicePath },
        targetId,
      } = this.props
      const data = { app, devicePath, targetId }
      await installApp.send(data).toPromise()
      this.setState({ status: 'success', app: '' })
    } catch (err) {
      this.setState({ status: 'error', error: err.message, app: '', mode: 'home' })
    }
  }

  handleUninstallApp = (app: LedgerScriptParams) => async () => {
    this.setState({ status: 'busy', app: app.name, mode: 'uninstalling' })
    try {
      const {
        device: { path: devicePath },
        targetId,
      } = this.props
      const data = { app, devicePath, targetId }
      await uninstallApp.send(data).toPromise()
      this.setState({ status: 'success', app: '' })
    } catch (err) {
      this.setState({ status: 'error', error: err.message, app: '', mode: 'home' })
    }
  }

  handleCloseModal = () => this.setState({ status: 'idle', mode: 'home' })

  renderModal = () => {
    const { t } = this.props
    const { app, status, error, mode } = this.state

    return (
      <Modal
        isOpened={status !== 'idle' && status !== 'loading'}
        render={() => (
          <ModalBody align="center" justify="center" style={{ height: 300 }}>
            {status === 'busy' || status === 'idle' ? (
              <Fragment>
                <ModalTitle>
                  {mode === 'installing' ? <Update size={30} /> : <Trash size={30} />}
                </ModalTitle>
                <ModalContent>
                  <Text ff="Museo Sans|Regular" fontSize={6} color="dark">
                    {t(`app:manager.apps.${mode}`, { app })}
                  </Text>
                  <Box mt={6}>
                    <Progress style={{ width: '100%' }} infinite />
                  </Box>
                </ModalContent>
              </Fragment>
            ) : status === 'error' ? (
              <Fragment>
                <ModalContent grow align="center" justify="center">
                  <Box color="alertRed">
                    <ExclamationCircle size={44} />
                  </Box>
                  <Box color="dark" mt={3} fontSize={6}>
                    {error}
                  </Box>
                </ModalContent>
                <ModalFooter horizontal justifyContent="flex-end" style={{ width: '100%' }}>
                  <Button primary onClick={this.handleCloseModal}>
                    close
                  </Button>
                </ModalFooter>
              </Fragment>
            ) : status === 'success' ? (
              <Fragment>
                <ModalTitle>
                  <Box color="positiveGreen">
                    <CheckCircle size={30} />
                  </Box>
                </ModalTitle>
                <ModalContent>
                  <Text ff="Museo Sans|Regular" fontSize={6} color="dark">
                    {t(
                      `app:manager.apps.${
                        mode === 'installing' ? 'installSuccess' : 'uninstallSuccess'
                      }`,
                      { app },
                    )}
                  </Text>
                </ModalContent>
                <ModalFooter horizontal justifyContent="flex-end">
                  <Button primary onClick={this.handleCloseModal}>
                    close
                  </Button>
                </ModalFooter>
              </Fragment>
            ) : null}
          </ModalBody>
        )}
      />
    )
  }

  renderList() {
    const { appsList, status } = this.state
    return status === 'idle' ? (
      <Box>
        <AppSearchBar list={appsList}>
          {items => (
            <List>
              {items.map(c => (
                <ManagerApp
                  key={`${c.name}_${c.version}`}
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

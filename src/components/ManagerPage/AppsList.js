// @flow
/* eslint-disable react/jsx-no-literals */ // FIXME

import React, { PureComponent, Fragment } from 'react'
import styled from 'styled-components'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { compose } from 'redux'
import type { Device, T } from 'types/common'
import type { LedgerScriptParams } from 'helpers/types'
import type { DeviceInfo } from 'helpers/devices/getDeviceInfo'
import { developerModeSelector } from 'reducers/settings'

import listApps from 'commands/listApps'
import listAppVersions from 'commands/listAppVersions'

import installApp from 'commands/installApp'
import uninstallApp from 'commands/uninstallApp'

import Box from 'components/base/Box'
import Space from 'components/base/Space'
import Modal, { ModalBody, ModalFooter, ModalTitle, ModalContent } from 'components/base/Modal'
import Tooltip from 'components/base/Tooltip'
import Text from 'components/base/Text'
import Progress from 'components/base/Progress'
import Spinner from 'components/base/Spinner'
import Button from 'components/base/Button'
import TranslatedError from 'components/TranslatedError'
import TrackPage from 'analytics/TrackPage'

import IconInfoCircle from 'icons/InfoCircle'
import ExclamationCircleThin from 'icons/ExclamationCircleThin'
import Update from 'icons/Update'
import Trash from 'icons/Trash'
import CheckCircle from 'icons/CheckCircle'

import { FreezeDeviceChangeEvents } from './HookDeviceChange'
import ManagerApp, { Container as FakeManagerAppContainer } from './ManagerApp'
import AppSearchBar from './AppSearchBar'

const mapStateToProps = state => ({
  isDevMode: developerModeSelector(state),
})

const List = styled(Box).attrs({
  horizontal: true,
  m: -3,
})`
  flex-wrap: wrap;
`

const ICONS_FALLBACK = {
  bitcoin_testnet: 'bitcoin',
}

type Status = 'loading' | 'idle' | 'busy' | 'success' | 'error'
type Mode = 'home' | 'installing' | 'uninstalling'

type Props = {
  device: Device,
  deviceInfo: DeviceInfo,
  t: T,
  isDevMode: boolean,
}

type State = {
  status: Status,
  error: ?Error,
  filteredAppVersionsList: LedgerScriptParams[],
  appsLoaded: boolean,
  app: string,
  mode: Mode,
}

const LoadingApp = () => (
  <FakeManagerAppContainer noShadow align="center" justify="center" style={{ height: 90 }}>
    <Spinner size={16} color="rgba(0, 0, 0, 0.3)" />
  </FakeManagerAppContainer>
)

const loadingApp = <LoadingApp />

class AppsList extends PureComponent<Props, State> {
  state = {
    status: 'loading',
    error: null,
    filteredAppVersionsList: [],
    appsLoaded: false,
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

  filterAppVersions = (applicationsList, compatibleAppVersionsList) => {
    if (!this.props.isDevMode) {
      return compatibleAppVersionsList.filter(
        version => applicationsList.find(e => e.id === version.app).category !== 2,
      )
    }
    return compatibleAppVersionsList
  }

  async fetchAppList() {
    try {
      const { deviceInfo } = this.props
      const applicationsList = await listApps.send({}).toPromise()
      const compatibleAppVersionsList = await listAppVersions.send(deviceInfo).toPromise()
      const filteredAppVersionsList = this.filterAppVersions(
        applicationsList,
        compatibleAppVersionsList,
      )

      if (!this._unmounted) {
        this.setState({
          status: 'idle',
          filteredAppVersionsList,
          appsLoaded: true,
        })
      }
    } catch (err) {
      this.setState({ status: 'error', error: err })
    }
  }

  handleInstallApp = (app: LedgerScriptParams) => async () => {
    this.setState({ status: 'busy', app: app.name, mode: 'installing' })
    try {
      const {
        device: { path: devicePath },
        deviceInfo,
      } = this.props
      const data = { app, devicePath, targetId: deviceInfo.targetId }
      await installApp.send(data).toPromise()
      this.setState({ status: 'success' })
    } catch (err) {
      this.setState({ status: 'error', error: err, mode: 'home' })
    }
  }

  handleUninstallApp = (app: LedgerScriptParams) => async () => {
    this.setState({ status: 'busy', app: app.name, mode: 'uninstalling' })
    try {
      const {
        device: { path: devicePath },
        deviceInfo,
      } = this.props
      const data = { app, devicePath, targetId: deviceInfo.targetId }
      await uninstallApp.send(data).toPromise()
      this.setState({ status: 'success' })
    } catch (err) {
      this.setState({ status: 'error', error: err, app: '', mode: 'home' })
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
            <FreezeDeviceChangeEvents />
            {status === 'busy' || status === 'idle' ? (
              <Fragment>
                <ModalTitle>
                  {mode === 'installing' ? (
                    <Box color="grey">
                      <Update size={30} />
                    </Box>
                  ) : (
                    <Box color="grey">
                      <Trash size={30} />
                    </Box>
                  )}
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
                <TrackPage
                  category="Manager"
                  name="Error Modal"
                  error={error && error.name}
                  app={app}
                />
                <ModalContent grow align="center" justify="center" mt={5}>
                  <Box color="alertRed">
                    <ExclamationCircleThin size={44} />
                  </Box>
                  <Box
                    color="dark"
                    mt={4}
                    fontSize={6}
                    ff="Museo Sans|Regular"
                    textAlign="center"
                    style={{ maxWidth: 350 }}
                  >
                    <TranslatedError error={error} field="title" />
                  </Box>
                  <Box
                    color="graphite"
                    mt={2}
                    fontSize={4}
                    ff="Open Sans"
                    textAlign="center"
                    style={{ maxWidth: 350 }}
                  >
                    <TranslatedError error={error} field="description" />
                  </Box>
                </ModalContent>
                <ModalFooter horizontal justifyContent="flex-end" style={{ width: '100%' }}>
                  <Button primary onClick={this.handleCloseModal}>
                    {t('app:common.close')}
                  </Button>
                </ModalFooter>
              </Fragment>
            ) : status === 'success' ? (
              <Fragment>
                <ModalContent grow align="center" justify="center" mt={5}>
                  <Box color="positiveGreen">
                    <CheckCircle size={44} />
                  </Box>
                  <Box
                    color="dark"
                    mt={4}
                    fontSize={6}
                    ff="Museo Sans|Regular"
                    textAlign="center"
                    style={{ maxWidth: 350 }}
                  >
                    {t(
                      `app:manager.apps.${
                        mode === 'installing' ? 'installSuccess' : 'uninstallSuccess'
                      }`,
                      { app },
                    )}
                  </Box>
                </ModalContent>
                <ModalFooter horizontal justifyContent="flex-end" style={{ width: '100%' }}>
                  <Button primary onClick={this.handleCloseModal}>
                    {t('app:common.close')}
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
    const { filteredAppVersionsList, appsLoaded } = this.state
    return (
      <Box>
        <AppSearchBar list={filteredAppVersionsList}>
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
        {!appsLoaded && (
          <Fragment>
            <Space of={30} />
            <List>
              {loadingApp}
              {loadingApp}
              {loadingApp}
              {loadingApp}
              {loadingApp}
              {loadingApp}
              {loadingApp}
              {loadingApp}
              {loadingApp}
            </List>
          </Fragment>
        )}
      </Box>
    )
  }

  render() {
    const { t } = this.props
    return (
      <Box flow={6}>
        <Box>
          <Box mb={4} color="dark" ff="Museo Sans" fontSize={5} flow={2} horizontal align="center">
            <span style={{ lineHeight: 1 }}>{t('app:manager.apps.all')}</span>
            <Tooltip
              render={() => (
                <Box ff="Open Sans|SemiBold" fontSize={2}>
                  {t('app:manager.apps.help')}
                </Box>
              )}
            >
              <Box color="grey">
                <IconInfoCircle size={12} />
              </Box>
            </Tooltip>
          </Box>
          {this.renderList()}
        </Box>
      </Box>
    )
  }
}

export default compose(
  translate(),
  connect(mapStateToProps),
)(AppsList)

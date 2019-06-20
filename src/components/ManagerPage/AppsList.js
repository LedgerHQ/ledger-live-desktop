// @flow
/* eslint-disable react/jsx-no-literals */ // FIXME

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { translate } from 'react-i18next'
import { compose } from 'redux'
import { getDeviceModel } from '@ledgerhq/devices'
import type { ApplicationVersion, DeviceInfo } from '@ledgerhq/live-common/lib/types/manager'
import type { CryptoCurrency } from '@ledgerhq/live-common/lib/types/currencies'
import manager from '@ledgerhq/live-common/lib/manager'
import { getEnv } from '@ledgerhq/live-common/lib/env'

import type { Device, T } from 'types/common'
import { getFullListSortedCryptoCurrencies } from 'helpers/countervalues'
import { openURL } from 'helpers/linking'
import { listCryptoCurrencies, isCurrencySupported } from 'config/cryptocurrencies'
import { urls } from 'config/urls'
import installApp from 'commands/installApp'
import uninstallApp from 'commands/uninstallApp'
import flushDevice from 'commands/flushDevice'
import Box from 'components/base/Box'
import Modal from 'components/base/Modal'
import Tooltip from 'components/base/Tooltip'
import Text from 'components/base/Text'
import ProgressBar from 'components/ProgressBar'
import Spinner from 'components/base/Spinner'
import Button from 'components/base/Button'
import ModalBody from 'components/base/Modal/ModalBody'
import TranslatedError from 'components/TranslatedError'
import TrackPage from 'analytics/TrackPage'
import IconInfoCircle from 'icons/InfoCircle'
import CheckFull from 'icons/CheckFull'
import ExclamationCircleThin from 'icons/ExclamationCircleThin'
import Update from 'icons/Update'
import Trash from 'icons/Trash'
import { FreezeDeviceChangeEvents } from './HookDeviceChange'
import ManagerApp, { Container as FakeManagerAppContainer } from './ManagerApp'
import AppSearchBar from './AppSearchBar'

const List = styled(Box).attrs({
  horizontal: true,
})`
  flex-wrap: wrap;

  > * {
    width: calc(50% - 10px);
    margin-bottom: 20px;
    &:nth-child(even) {
      margin-left: 20px;
    }

    @media (max-width: 1000px) {
      width: 100%;
      &:nth-child(even) {
        margin-left: 0;
      }
    }
  }
`

const IconWrapper = styled(Box).attrs({})`
  position: relative;
`

const AppIcon = styled.img`
  display: block;
  width: 56px;
  height: 56px;
  pointer-events: none;
`

const AppCheck = styled(Box).attrs({
  align: 'center',
  justify: 'center',
})`
  color: ${({ theme }) => theme.colors.positiveGreen};
  border-radius: 24px;
  border: 4px solid white;
  position: absolute;
  top: -18px;
  right: -12px;
`

const ICONS_FALLBACK = {
  bitcoin_testnet: 'bitcoin',
}

const CATALOG_INFO_ICON = (
  <Box color="grey">
    <IconInfoCircle size={12} />
  </Box>
)

type Status = 'loading' | 'idle' | 'busy' | 'success' | 'error'
type Mode = 'home' | 'installing' | 'uninstalling'

type Props = {
  device: Device,
  deviceInfo: DeviceInfo,
  t: T,
}

type State = {
  status: Status,
  error: ?Error,
  filteredAppVersionsList: Array<ApplicationVersion>,
  appsLoaded: boolean,
  app: ?ApplicationVersion,
  mode: Mode,
  progress: number,
}

const oldAppsInstallDisabled = ['ZenCash', 'Ripple']
const terminatedCryptoCurrencies: Array<CryptoCurrency> = listCryptoCurrencies(true, true)
const canHandleInstall = app =>
  !oldAppsInstallDisabled.includes(app.name) &&
  !terminatedCryptoCurrencies.some(coin => coin.managerAppName === app.name)

const LoadingApp = () => (
  <FakeManagerAppContainer noShadow align="center" justify="center" style={{ height: 90 }}>
    <Spinner size={16} color="rgba(0, 0, 0, 0.3)" />
  </FakeManagerAppContainer>
)

const loadingApp = <LoadingApp />

const FAKE_LIST = (
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
)

class AppsList extends PureComponent<Props, State> {
  state = {
    status: 'loading',
    error: null,
    filteredAppVersionsList: [],
    appsLoaded: false,
    app: null,
    mode: 'home',
    progress: 0,
  }

  componentDidMount() {
    this.fetchAppList()
  }

  componentWillUnmount() {
    this._unmounted = true
    if (this.sub) {
      this.sub.unsubscribe()
      this.flush()
    }
  }

  _unmounted = false

  async fetchAppList() {
    const { deviceInfo } = this.props

    try {
      const filteredAppVersionsList = await manager.getAppsList(
        deviceInfo,
        getEnv('MANAGER_DEV_MODE'),
        getFullListSortedCryptoCurrencies,
      )

      const withTickers = filteredAppVersionsList.map(app => {
        const maybeCrypto = listCryptoCurrencies(true, false, false).find(
          c => c.managerAppName.toLowerCase() === app.name.toLowerCase(),
        )
        const ticker = maybeCrypto ? maybeCrypto.ticker : ''

        return {
          ...app,
          ticker,
        }
      })

      if (!this._unmounted) {
        this.setState({
          status: 'idle',
          filteredAppVersionsList: withTickers,
          appsLoaded: true,
        })
      }
    } catch (err) {
      this.setState({ status: 'error', error: err })
    }
  }

  flush = async () => {
    const {
      device: { path: deviceId },
    } = this.props
    await flushDevice.send(deviceId).toPromise()
  }

  sub: *
  runAppScript = (app: ApplicationVersion, mode: *, cmd: *) => {
    this.setState({ status: 'busy', app, mode, progress: 0 })
    const {
      device: { path: devicePath },
      deviceInfo: { targetId },
    } = this.props
    this.sub = cmd.send({ app, devicePath, targetId }).subscribe({
      next: patch => {
        this.setState(patch)
      },
      complete: () => {
        this.setState({ status: 'success' })
      },
      error: error => {
        this.setState({ status: 'error', error, mode: 'home' })
      },
    })
  }

  handleInstallApp = (app: ApplicationVersion) => () =>
    this.runAppScript(app, 'installing', installApp)

  handleUninstallApp = (app: ApplicationVersion) => () =>
    this.runAppScript(app, 'uninstalling', uninstallApp)

  handleCloseModal = () => {
    if (this.sub) this.sub.unsubscribe()
    this.flush()
    this.setState({ status: 'idle', mode: 'home' })
  }

  handleLearnMore = () => {
    openURL(urls.appSupport)
    this.handleCloseModal()
  }

  renderBody = () => {
    const { t, device } = this.props
    const { app, status, error, mode, progress } = this.state

    const isCurrency = app && app.currency
    const isSupported = app && app.currency && isCurrencySupported(app.currency)
    const isInstalling = mode === 'installing'

    return ['busy', 'idle'].includes(status) ? (
      <Box grow align="center" justify="center">
        {isInstalling ? (
          <Box color="grey" grow align="center" mb={5}>
            <Update size={30} />
          </Box>
        ) : (
          <Box color="grey" grow align="center" mb={5}>
            <Trash size={30} />
          </Box>
        )}
        {app ? (
          <Text ff="Museo Sans|Regular" fontSize={6} color="dark">
            {mode !== 'home' ? t(`manager.apps.${mode}`, { app: app.name || '' }) : null}
          </Text>
        ) : null}
        <Box mt={6}>
          <ProgressBar width={150} progress={progress} />
        </Box>
      </Box>
    ) : status === 'error' ? (
      <Box>
        <TrackPage
          category="Manager"
          name="Error Modal"
          error={error && error.name}
          app={app ? app.name : ''}
        />
        <Box grow align="center" justify="center" mt={5}>
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
        </Box>
      </Box>
    ) : status === 'success' ? (
      <Box grow align="center" justify="center" mt={5}>
        <IconWrapper>
          <AppCheck>
            <CheckFull size={24} />
          </AppCheck>
          <AppIcon src={manager.getIconUrl(app ? app.icon : '')} />
        </IconWrapper>
        <Box
          color="dark"
          mt={4}
          fontSize={6}
          ff="Museo Sans|Regular"
          textAlign="center"
          style={{ maxWidth: 350 }}
        >
          {t(
            `manager.apps.${
              isInstalling
                ? isSupported || !isCurrency
                  ? 'installSuccess'
                  : 'unsupportedSuccess'
                : 'uninstallSuccess'
            }`,
            {
              app: app ? app.name : '',
            },
          )}
        </Box>
        {app && app.currency && isInstalling ? (
          <Box
            color="smoke"
            mt={2}
            fontSize={4}
            ff="Open Sans|Regular"
            textAlign="center"
            style={{ maxWidth: 350 }}
          >
            {t(`manager.apps.${isSupported ? 'supportedCurrency' : 'unsupportedCurrency'}`, {
              app: app.name,
              device: getDeviceModel(device.modelId).productName,
            })}
          </Box>
        ) : null}
      </Box>
    ) : null
  }

  renderFooter = () => {
    const { t } = this.props
    const { app, mode } = this.state

    const isInstalling = mode === 'installing'
    const isCurrency = app && app.currency
    const isSupported = app && app.currency && isCurrencySupported(app.currency)

    return isCurrency && isInstalling && !isSupported ? (
      <Box horizontal justifyContent="flex-end" style={{ width: '100%' }}>
        <Button onClick={this.handleCloseModal}>{t('common.close')}</Button>
        <Button style={{ marginLeft: 10 }} primary onClick={this.handleLearnMore}>
          {t('common.learnMore')}
        </Button>
      </Box>
    ) : (
      <Box horizontal justifyContent="flex-end" style={{ width: '100%' }}>
        <Button primary onClick={this.handleCloseModal}>
          {t('common.close')}
        </Button>
      </Box>
    )
  }

  renderModal = () => {
    const { status, mode } = this.state
    const { t } = this.props
    const shouldDisplayTitle = mode !== 'home' && status === 'success'
    return (
      <Modal
        isOpened={status !== 'idle' && status !== 'loading'}
        preventBackdropClick={['installing', 'uninstalling'].includes(mode)}
        centered
        onClose={null}
      >
        <ModalBody
          align="center"
          justify="center"
          title={
            shouldDisplayTitle
              ? t(`manager.apps.${mode === 'installing' ? 'installed' : 'uninstalled'}`)
              : ''
          }
          render={this.renderBody}
          onClose={this.handleCloseModal}
          renderFooter={['error', 'success'].includes(status) ? this.renderFooter : undefined}
        >
          <FreezeDeviceChangeEvents />
        </ModalBody>
      </Modal>
    )
  }

  renderList() {
    const { filteredAppVersionsList, appsLoaded } = this.state
    return (
      <Box>
        <AppSearchBar searchKeys={['ticker']} list={filteredAppVersionsList}>
          {items => (
            <List>
              {items.map(c => (
                <ManagerApp
                  key={`${c.name}_${c.version}`}
                  name={c.name}
                  version={`Version ${c.version}`}
                  icon={ICONS_FALLBACK[c.icon] || c.icon}
                  onInstall={canHandleInstall(c) ? this.handleInstallApp(c) : null}
                  onUninstall={this.handleUninstallApp(c)}
                />
              ))}
            </List>
          )}
        </AppSearchBar>
        {this.renderModal()}
        {!appsLoaded && FAKE_LIST}
      </Box>
    )
  }

  renderTooltip = () => {
    const { t } = this.props
    return (
      <Box ff="Open Sans|SemiBold" fontSize={2}>
        {t('manager.apps.help')}
      </Box>
    )
  }

  render() {
    const { t } = this.props

    return (
      <Box>
        <Box mb={4} color="dark" ff="Museo Sans" fontSize={5} flow={2} horizontal align="center">
          <span>{t('manager.apps.all')}</span>
          <Tooltip render={this.renderTooltip}>{CATALOG_INFO_ICON}</Tooltip>
        </Box>
        {this.renderList()}
      </Box>
    )
  }
}

export default compose(translate())(AppsList)

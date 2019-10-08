// @flow

import React, { PureComponent, Fragment } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { compose } from 'redux'
import get from 'lodash/get'
import { translate } from 'react-i18next'

import type { Account, Unit, CryptoCurrency } from '@ledgerhq/live-common/lib/types'
import type { T } from 'types/common'
import { MODAL_SETTINGS_ACCOUNT, MAX_ACCOUNT_NAME_SIZE } from 'config/constants'
import { validateNameEdition } from '@ledgerhq/live-common/lib/account'

import { updateAccount, removeAccount } from 'actions/accounts'
import { setDataModal } from 'reducers/modals'

import { getAccountBridge } from '@ledgerhq/live-common/lib/bridge'

import { AccountNameRequiredError, EnpointConfigError } from '@ledgerhq/errors'

import TrackPage from 'analytics/TrackPage'
import Spoiler from 'components/base/Spoiler'
import CryptoCurrencyIcon from 'components/CryptoCurrencyIcon'
import Box from 'components/base/Box'
import Space from 'components/base/Space'
import Button from 'components/base/Button'
import Input from 'components/base/Input'
import Select from 'components/base/Select'
import SyncAgo from 'components/SyncAgo'

import ConfirmModal from 'components/base/Modal/ConfirmModal'
import ModalBody from 'components/base/Modal/ModalBody'

type State = {
  accountName: ?string,
  accountUnit: ?Unit,
  endpointConfig: ?string,
  accountNameError: ?Error,
  endpointConfigError: ?Error,
  isRemoveAccountModalOpen: boolean,
}

type Props = {
  setDataModal: Function,
  updateAccount: Function,
  removeAccount: Function,
  t: T,
  onClose: () => void,
  data: any,
}

const canConfigureEndpointConfig = account => account.currency.id === 'ripple'

const unitGetOptionValue = unit => unit.magnitude
const renderUnitItemCode = item => item.data.code

const mapDispatchToProps = {
  setDataModal,
  updateAccount,
  removeAccount,
}

const defaultState = {
  accountName: null,
  accountUnit: null,
  endpointConfig: null,
  accountNameError: null,
  endpointConfigError: null,
  isRemoveAccountModalOpen: false,
}

class AccountSettingRenderBody extends PureComponent<Props, State> {
  state = {
    ...defaultState,
  }

  componentWillUnmount() {
    this.handleChangeEndpointConfig_id++
  }

  getAccount(data: Object): Account {
    const { accountName } = this.state
    const account = get(data, 'account', {})

    return {
      ...account,
      ...(accountName !== null
        ? {
            name: accountName,
          }
        : {}),
    }
  }

  handleChangeEndpointConfig_id = 0
  handleChangeEndpointConfig = async (endpointConfig: string) => {
    const bridge = getAccountBridge(this.getAccount(this.props.data))
    this.handleChangeEndpointConfig_id++
    const { handleChangeEndpointConfig_id } = this
    this.setState({
      endpointConfig,
      endpointConfigError: null,
    })
    try {
      if (bridge.validateEndpointConfig) {
        await bridge.validateEndpointConfig(endpointConfig)
      }
      if (handleChangeEndpointConfig_id === this.handleChangeEndpointConfig_id) {
        this.setState({
          endpointConfigError: null,
        })
      }
    } catch (endpointConfigError) {
      if (handleChangeEndpointConfig_id === this.handleChangeEndpointConfig_id) {
        this.setState({ endpointConfigError: new EnpointConfigError() })
      }
    }
  }

  handleChangeName = (value: string) =>
    this.setState({
      accountName: value,
    })

  handleSubmit = (account: Account, onClose: () => void) => (
    e: SyntheticEvent<HTMLFormElement | HTMLInputElement>,
  ) => {
    e.preventDefault()
    const { updateAccount, setDataModal } = this.props
    const { accountName, accountUnit, endpointConfig, endpointConfigError } = this.state

    if (!account.name.length) {
      this.setState({ accountNameError: new AccountNameRequiredError() })
    } else if (!endpointConfigError) {
      const name = validateNameEdition(account, accountName)

      account = {
        ...account,
        unit: accountUnit || account.unit,
        name,
      }
      if (endpointConfig && !endpointConfigError) {
        account.endpointConfig = endpointConfig
      }
      updateAccount(account)
      setDataModal(MODAL_SETTINGS_ACCOUNT, { account })
      onClose()
    }
  }

  handleFocus = (e: any, name: string) => {
    e.target.select()

    switch (name) {
      case 'accountName':
        this.setState({ accountNameError: null })
        break
      case 'endpointConfig':
        this.setState({ endpointConfigError: null })
        break
      default:
        break
    }
  }

  handleChangeUnit = (value: Unit) => {
    this.setState({ accountUnit: value })
  }

  handleOpenRemoveAccountModal = () => this.setState({ isRemoveAccountModalOpen: true })

  handleCloseRemoveAccountModal = () => this.setState({ isRemoveAccountModalOpen: false })

  handleRemoveAccount = (account: Account) => {
    const { removeAccount, onClose } = this.props
    removeAccount(account)
    this.setState({ isRemoveAccountModalOpen: false })
    onClose()
  }

  render() {
    const {
      accountUnit,
      endpointConfig,
      accountNameError,
      isRemoveAccountModalOpen,
      endpointConfigError,
    } = this.state
    const { t, onClose, data } = this.props
    if (!data) return null

    const account = this.getAccount(data)
    const bridge = getAccountBridge(account)
    const usefulData = {
      xpub: account.xpub || undefined,
      index: account.index,
      freshAddressPath: account.freshAddressPath,
      id: account.id,
      blockHeight: account.blockHeight,
    }

    const onSubmit = this.handleSubmit(account, onClose)

    return (
      <ModalBody
        onClose={onClose}
        title={t('account.settings.title')}
        render={() => (
          <Fragment>
            <TrackPage category="Modal" name="AccountSettings" />
            <Container>
              <Box>
                <OptionRowTitle>{t('account.settings.accountName.title')}</OptionRowTitle>
                <OptionRowDesc>{t('account.settings.accountName.desc')}</OptionRowDesc>
              </Box>
              <Box>
                <Input
                  autoFocus
                  containerProps={{ style: { width: 230 } }}
                  value={account.name}
                  maxLength={MAX_ACCOUNT_NAME_SIZE}
                  onChange={this.handleChangeName}
                  onEnter={onSubmit}
                  onFocus={e => this.handleFocus(e, 'accountName')}
                  error={accountNameError}
                />
              </Box>
            </Container>
            <Container>
              <Box>
                <OptionRowTitle>{t('account.settings.unit.title')}</OptionRowTitle>
                <OptionRowDesc>{t('account.settings.unit.desc')}</OptionRowDesc>
              </Box>
              <Box style={{ width: 230 }}>
                <Select
                  isSearchable={false}
                  onChange={this.handleChangeUnit}
                  getOptionValue={unitGetOptionValue}
                  renderValue={renderUnitItemCode}
                  renderOption={renderUnitItemCode}
                  value={accountUnit || account.unit}
                  options={account.currency.units}
                />
              </Box>
            </Container>
            {canConfigureEndpointConfig(account) ? (
              <Container>
                <Box>
                  <OptionRowTitle>{t('account.settings.endpointConfig.title')}</OptionRowTitle>
                  <OptionRowDesc>{t('account.settings.endpointConfig.desc')}</OptionRowDesc>
                </Box>
                <Box>
                  <Input
                    value={
                      endpointConfig ||
                      account.endpointConfig ||
                      (bridge.getDefaultEndpointConfig && bridge.getDefaultEndpointConfig()) ||
                      ''
                    }
                    onChange={this.handleChangeEndpointConfig}
                    onFocus={e => this.handleFocus(e, 'endpointConfig')}
                    error={endpointConfigError}
                  />
                </Box>
              </Container>
            ) : null}
            <Spoiler textTransform title={t('account.settings.advancedLogs')}>
              <SyncAgo date={account.lastSyncDate} />
              <AdvancedLogsContainer>{JSON.stringify(usefulData, null, 2)}</AdvancedLogsContainer>
            </Spoiler>
            <ConfirmModal
              analyticsName="RemoveAccount"
              isDanger
              centered
              isOpened={isRemoveAccountModalOpen}
              onClose={this.handleCloseRemoveAccountModal}
              onReject={this.handleCloseRemoveAccountModal}
              onConfirm={() => this.handleRemoveAccount(account)}
              title={t('settings.removeAccountModal.title')}
              subTitle={t('common.areYouSure')}
              desc={t('settings.removeAccountModal.desc')}
            />
            <Space of={20} />
          </Fragment>
        )}
        renderFooter={() => (
          <Fragment>
            <Button
              event="OpenAccountDelete"
              danger
              type="button"
              onClick={this.handleOpenRemoveAccountModal}
            >
              {t('common.delete')}
            </Button>
            <Button event="DoneEditingAccount" ml="auto" onClick={onSubmit} primary>
              {t('common.apply')}
            </Button>
          </Fragment>
        )}
      />
    )
  }
}

const AdvancedLogsContainer = styled.div`
  border: 1px dashed ${p => p.theme.colors.palette.background.default};
  background-color: ${p => p.theme.colors.palette.background.default};
  color: ${p => p.theme.colors.palette.text.shade100};
  font-family: monospace;
  font-size: 11px;
  outline: none;
  padding: 20px;
  width: 100%;
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow: auto;
  user-select: auto;
`

export default compose(
  connect(
    null,
    mapDispatchToProps,
  ),
  translate(),
)(AccountSettingRenderBody)

export function InputLeft({ currency }: { currency: CryptoCurrency }) {
  return (
    <Box ml={2} style={{ justifyContent: 'center' }} color={currency.color}>
      <CryptoCurrencyIcon currency={currency} size={16} />
    </Box>
  )
}

export const Container = styled(Box).attrs(() => ({
  flow: 2,
  justify: 'space-between',
  horizontal: true,
  mb: 3,
  pb: 4,
}))`
  border-bottom: 1px solid ${p => p.theme.colors.palette.divider};
`

export const OptionRowDesc = styled(Box).attrs(() => ({
  ff: 'Inter|Regular',
  fontSize: 3,
  textAlign: 'left',
  lineHeight: 1.69,
  color: 'palette.text.shade60',
  shrink: 1,
}))``
export const OptionRowTitle = styled(Box).attrs(() => ({
  ff: 'Inter|SemiBold',
  color: 'palette.text.shade100',
  fontSize: 4,
  textAlign: 'left',
  lineHeight: 1.69,
}))``

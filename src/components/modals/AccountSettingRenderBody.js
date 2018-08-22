// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { compose } from 'redux'
import get from 'lodash/get'
import { translate } from 'react-i18next'

import type { Account, Unit, Currency } from '@ledgerhq/live-common/lib/types'
import type { T } from 'types/common'
import { MODAL_SETTINGS_ACCOUNT, MAX_ACCOUNT_NAME_SIZE } from 'config/constants'
import { validateNameEdition } from 'helpers/accountName'

import { updateAccount, removeAccount } from 'actions/accounts'
import { setDataModal } from 'reducers/modals'

import { getBridgeForCurrency } from 'bridge'

import { createCustomErrorClass } from 'helpers/errors'

import TrackPage from 'analytics/TrackPage'
import Spoiler from 'components/base/Spoiler'
import CryptoCurrencyIcon from 'components/CryptoCurrencyIcon'
import Box from 'components/base/Box'
import Button from 'components/base/Button'
import Input from 'components/base/Input'
import Select from 'components/base/Select'
import SyncAgo from 'components/SyncAgo'

import {
  ModalBody,
  ModalTitle,
  ModalFooter,
  ModalContent,
  ConfirmModal,
} from 'components/base/Modal'

const AccountNameRequiredError = createCustomErrorClass('AccountNameRequired')
const EnpointConfigError = createCustomErrorClass('EnpointConfig')

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

class HelperComp extends PureComponent<Props, State> {
  state = {
    ...defaultState,
  }

  componentWillUnmount() {
    this.handleChangeEndpointConfig_id++
  }

  getAccount(data: Object): Account {
    // FIXME this should be a selector
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
    const bridge = getBridgeForCurrency(this.getAccount(this.props.data).currency)
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
    e: SyntheticEvent<HTMLFormElement>,
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

    const account = this.getAccount(data)
    const bridge = getBridgeForCurrency(account.currency)

    const usefulData = {
      xpub: account.xpub || undefined,
      index: account.index,
      freshAddressPath: account.freshAddressPath,
      id: account.id,
      blockHeight: account.blockHeight,
    }

    return (
      <ModalBody onClose={onClose}>
        <form onSubmit={this.handleSubmit(account, onClose)}>
          <TrackPage category="Modal" name="AccountSettings" />
          <ModalTitle>{t('app:account.settings.title')}</ModalTitle>
          <ModalContent mb={3}>
            <Container>
              <Box>
                <OptionRowTitle>{t('app:account.settings.accountName.title')}</OptionRowTitle>
                <OptionRowDesc>{t('app:account.settings.accountName.desc')}</OptionRowDesc>
              </Box>
              <Box>
                <Input
                  autoFocus
                  containerProps={{ style: { width: 230 } }}
                  value={account.name}
                  maxLength={MAX_ACCOUNT_NAME_SIZE}
                  onChange={this.handleChangeName}
                  onFocus={e => this.handleFocus(e, 'accountName')}
                  error={accountNameError}
                />
              </Box>
            </Container>
            <Container>
              <Box>
                <OptionRowTitle>{t('app:account.settings.unit.title')}</OptionRowTitle>
                <OptionRowDesc>{t('app:account.settings.unit.desc')}</OptionRowDesc>
              </Box>
              <Box style={{ width: 230 }}>
                <Select
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
                  <OptionRowTitle>{t('app:account.settings.endpointConfig.title')}</OptionRowTitle>
                  <OptionRowDesc>{t('app:account.settings.endpointConfig.desc')}</OptionRowDesc>
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
            <Spoiler textTransform title={t('app:account.settings.advancedLogs')}>
              <SyncAgo date={account.lastSyncDate} />
              <textarea
                readOnly
                style={{
                  userSelect: 'text',
                  border: '1px dashed #f9f9f9',
                  backgroundColor: '#f9f9f9',
                  color: '#000',
                  fontFamily: 'monospace',
                  fontSize: '10px',
                  height: 200,
                  outline: 'none',
                  padding: '20px',
                }}
                value={JSON.stringify(usefulData, null, 2)}
              />
            </Spoiler>
          </ModalContent>
          <ModalFooter horizontal>
            <Button
              event="OpenAccountDelete"
              danger
              type="button"
              onClick={this.handleOpenRemoveAccountModal}
            >
              {t('app:common.delete')}
            </Button>
            <Button event="DoneEditingAccount" ml="auto" type="submit" primary>
              {t('app:common.apply')}
            </Button>
          </ModalFooter>
        </form>
        <ConfirmModal
          analyticsName="RemoveAccount"
          isDanger
          isOpened={isRemoveAccountModalOpen}
          onClose={this.handleCloseRemoveAccountModal}
          onReject={this.handleCloseRemoveAccountModal}
          onConfirm={() => this.handleRemoveAccount(account)}
          title={t('app:settings.removeAccountModal.title')}
          subTitle={t('app:common.areYouSure')}
          desc={t('app:settings.removeAccountModal.desc')}
        />
      </ModalBody>
    )
  }
}

export default compose(
  connect(
    null,
    mapDispatchToProps,
  ),
  translate(),
)(HelperComp)

export function InputLeft({ currency }: { currency: Currency }) {
  return (
    <Box ml={2} style={{ justifyContent: 'center' }} color={currency.color}>
      <CryptoCurrencyIcon currency={currency} size={16} />
    </Box>
  )
}

export const Container = styled(Box).attrs({
  flow: 2,
  justify: 'space-between',
  horizontal: true,
  mb: 3,
  pb: 4,
})`
  border-bottom: 1px solid ${p => p.theme.colors.lightGrey};
`

export const OptionRowDesc = styled(Box).attrs({
  ff: 'Open Sans|Regular',
  fontSize: 3,
  textAlign: 'left',
  lineHeight: 1.69,
  color: 'grey',
  shrink: 1,
})``
export const OptionRowTitle = styled(Box).attrs({
  ff: 'Open Sans|SemiBold',
  color: 'black',
  fontSize: 4,
  textAlign: 'left',
  lineHeight: 1.69,
})``

// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { compose } from 'redux'
import get from 'lodash/get'
import { translate } from 'react-i18next'

import type { Account, Unit, Currency } from '@ledgerhq/live-common/lib/types'
import type { T } from 'types/common'
import { MODAL_SETTINGS_ACCOUNT } from 'config/constants'

import { updateAccount } from 'actions/accounts'
import { setDataModal } from 'reducers/modals'

import CryptoCurrencyIcon from 'components/CryptoCurrencyIcon'
import Box from 'components/base/Box'
import Button from 'components/base/Button'
import Input, { ErrorMessageInput } from 'components/base/Input'
import Select from 'components/base/LegacySelect'
import { ModalBody, ModalTitle, ModalFooter, ModalContent } from 'components/base/Modal'

type State = {
  accountName: string | null,
  accountUnit: Unit | null,
  accountNameError: boolean,
}

type Props = {
  setDataModal: Function,
  updateAccount: Function,
  t: T,
  onClose: () => void,
  data: any,
}

const mapDispatchToProps = {
  setDataModal,
  updateAccount,
}

const defaultState = {
  accountName: null,
  accountUnit: null,
  accountNameError: false,
}

class HelperComp extends PureComponent<Props, State> {
  state = {
    ...defaultState,
  }

  getAccount(data: Object) {
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

  handleChangeName = (value: string) =>
    this.setState({
      accountName: value,
    })

  handleSubmit = (account: Account, onClose: () => void) => (
    e: SyntheticEvent<HTMLFormElement>,
  ) => {
    e.preventDefault()

    const { updateAccount, setDataModal } = this.props
    const { accountName, accountUnit } = this.state

    if (accountName !== '') {
      account = { ...account, unit: accountUnit || account.unit }
      updateAccount(account)
      setDataModal(MODAL_SETTINGS_ACCOUNT, { account })
      onClose()
    } else {
      this.setState({ accountNameError: true })
    }
  }

  handleFocus = (e: any, name: string) => {
    e.target.select()

    switch (name) {
      case 'accountName':
        this.setState({ accountNameError: false })
        break
      default:
        break
    }
  }

  handleChangeUnit = (value: Unit) => {
    this.setState({ accountUnit: value })
  }

  render() {
    const { accountUnit, accountNameError } = this.state
    const { t, onClose, data } = this.props

    const account = this.getAccount(data)

    return (
      <ModalBody onClose={onClose}>
        <form onSubmit={this.handleSubmit(account, onClose)}>
          <ModalTitle>{t('account:settings.title')}</ModalTitle>
          <ModalContent mb={3}>
            <Container>
              <Box>
                <OptionRowTitle>{t('account:settings.accountName.title')}</OptionRowTitle>
                <OptionRowDesc>{t('account:settings.accountName.desc')}</OptionRowDesc>
              </Box>
              <Box>
                <Input
                  value={account.name}
                  onChange={this.handleChangeName}
                  renderLeft={<InputLeft currency={account.currency} />}
                  onFocus={e => this.handleFocus(e, 'accountName')}
                />
                {accountNameError && (
                  <ErrorMessageInput>{t('account:settings.accountName.error')}</ErrorMessageInput>
                )}
              </Box>
            </Container>
            <Container>
              <Box>
                <OptionRowTitle>{t('account:settings.unit.title')}</OptionRowTitle>
                <OptionRowDesc>{t('account:settings.unit.desc')}</OptionRowDesc>
              </Box>
              <Box style={{ width: 180 }}>
                <Select
                  keyProp="code"
                  onChange={this.handleChangeUnit}
                  renderSelected={item => item && item.code}
                  renderItem={item => item && item.code}
                  value={accountUnit || account.unit}
                  items={account.currency.units}
                />
              </Box>
            </Container>
          </ModalContent>
          <ModalFooter>
            <Button small ml="auto" type="submit" primary>
              {t('common:apply')}
            </Button>
          </ModalFooter>
        </form>
      </ModalBody>
    )
  }
}

export default compose(connect(null, mapDispatchToProps), translate())(HelperComp)

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

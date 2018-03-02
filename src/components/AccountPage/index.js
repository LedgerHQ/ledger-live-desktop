// @flow

import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import { Redirect } from 'react-router'

import { MODAL_SEND, MODAL_RECEIVE, MODAL_SETTINGS_ACCOUNT } from 'constants'

import type { MapStateToProps } from 'react-redux'
import type { T, Account } from 'types/common'

import { formatBTC } from 'helpers/format'

import { getAccountById } from 'reducers/accounts'
import { openModal } from 'reducers/modals'

import Box, { Card } from 'components/base/Box'
import Button from 'components/base/Button'
import IconControls from 'icons/Controls'
import Text from 'components/base/Text'
import TransactionsList from 'components/TransactionsList'
import IconArrowUp from 'icons/ArrowUp'
import IconArrowDown from 'icons/ArrowDown'
import AccountHeader from './AccountHeader'

type Props = {
  t: T,
  account?: Account,
  openModal: Function,
}

const mapStateToProps: MapStateToProps<*, *, *> = (state, props) => ({
  account: getAccountById(state, props.match.params.id),
})

const mapDispatchToProps = {
  openModal,
}

class AccountPage extends PureComponent<Props> {
  render() {
    const { account, openModal, t } = this.props

    // Don't even throw if we jumped in wrong account route
    if (!account) {
      return <Redirect to="/" />
    }

    return (
      <Box flow={7}>
        <Box horizontal>
          <AccountHeader account={account} />
          <Box horizontal alignItems="center" justifyContent="flex-end" grow flow={2}>
            <Button primary onClick={() => openModal(MODAL_SEND, { account })}>
              <Box horizontal flow={2} alignItems="center">
                <IconArrowUp height={16} width={16} />
                <Box>{t('send:title')}</Box>
              </Box>
            </Button>
            <Button primary onClick={() => openModal(MODAL_RECEIVE, { account })}>
              <Box horizontal flow={2} alignItems="center">
                <IconArrowDown height={16} width={16} />
                <Box>{t('receive:title')}</Box>
              </Box>
            </Button>
            <Button
              style={{ width: 30, padding: 0 }}
              onClick={() => openModal(MODAL_SETTINGS_ACCOUNT, { account })}
            >
              <Box align="center">
                <IconControls width={16} />
              </Box>
            </Button>
          </Box>
        </Box>
        <Card style={{ height: 435 }} alignItems="center" justifyContent="center">
          <Text fontSize={5}>{formatBTC(account.balance)}</Text>
        </Card>
        <TransactionsList
          title={t('account:lastOperations')}
          transactions={account.transactions}
          minConfirmations={account.settings.minConfirmations}
        />
      </Box>
    )
  }
}

export default compose(connect(mapStateToProps, mapDispatchToProps), translate())(AccountPage)

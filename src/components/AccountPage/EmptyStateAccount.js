// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { translate, Trans } from 'react-i18next'

import { openModal } from 'reducers/modals'
import type { T } from 'types/common'
import type { Account, TokenAccount } from '@ledgerhq/live-common/lib/types'
import { listTokenTypesForCryptoCurrency } from '@ledgerhq/live-common/lib/currencies'
import { getMainAccount } from '@ledgerhq/live-common/lib/account'

import { MODAL_RECEIVE } from 'config/constants'

import IconReceive from 'icons/Receive'
import Box from 'components/base/Box'
import Image from 'components/base/Image'
import Text from 'components/base/Text'
import Button from 'components/base/Button'
import { Title, Description } from '../AccountsPage/EmptyState'

const mapDispatchToProps = {
  openModal,
}

type Props = {
  t: T,
  account: TokenAccount | Account,
  parentAccount: ?Account,
  openModal: Function,
}

class EmptyStateAccount extends PureComponent<Props, *> {
  render() {
    const { t, account, parentAccount, openModal } = this.props
    const mainAccount = getMainAccount(account, parentAccount)
    if (!mainAccount) return null

    const hasTokens = Array.isArray(mainAccount.subAccounts)

    return (
      <Box mt={7} alignItems="center" selectable>
        <Image
          alt="emptyState Dashboard logo"
          resource="empty-state-account.svg"
          width="400"
          height="89"
          themeTyped
        />
        <Box mt={5} alignItems="center">
          <Title>{t('account.emptyState.title')}</Title>
          <Description mt={3} style={{ display: 'block' }}>
            {hasTokens ? (
              <Trans i18nKey="account.emptyState.descToken">
                {'Make sure the'}
                <Text ff="Inter|SemiBold" color="palette.text.shade100">
                  {mainAccount.currency.managerAppName}
                </Text>
                {'app is installed and start receiving'}
                <Text ff="Inter|SemiBold" color="palette.text.shade100">
                  {mainAccount.currency.ticker}
                </Text>
                {'and'}
                <Text ff="Inter|SemiBold" color="palette.text.shade100">
                  {account &&
                    account.currency &&
                    // $FlowFixMe
                    listTokenTypesForCryptoCurrency(account.currency).join(', ')}
                  {'tokens'}
                </Text>
              </Trans>
            ) : (
              <Trans i18nKey="account.emptyState.desc">
                {'Make sure the'}
                <Text ff="Inter|SemiBold" color="palette.text.shade100">
                  {mainAccount.currency.managerAppName}
                </Text>
                {'app is installed and start receiving'}
              </Trans>
            )}
          </Description>
          <Button
            mt={5}
            primary
            onClick={() => openModal(MODAL_RECEIVE, { account, parentAccount })}
          >
            <Box horizontal flow={1} alignItems="center">
              <IconReceive size={12} />
              <Box>{t('account.emptyState.buttons.receiveFunds')}</Box>
            </Box>
          </Button>
        </Box>
      </Box>
    )
  }
}

export default compose(
  connect(
    null,
    mapDispatchToProps,
  ),
  translate(),
)(EmptyStateAccount)

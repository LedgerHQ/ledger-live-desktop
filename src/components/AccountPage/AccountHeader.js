// @flow

import React, { useCallback } from 'react'
import styled from 'styled-components'
import { Trans } from 'react-i18next'

import type { AccountLike, Account } from '@ledgerhq/live-common/lib/types'
import {
  getDefaultExplorerView,
  getAccountContractExplorer,
} from '@ledgerhq/live-common/lib/explorers'
import {
  getAccountCurrency,
  getMainAccount,
  shortAddressPreview,
  getAccountName,
} from '@ledgerhq/live-common/lib/account'
import Box from 'components/base/Box'
import Ellipsis from 'components/base/Ellipsis'
import Text from 'components/base/Text'
import ExternalLink from 'icons/ExternalLink'
import { openURL } from 'helpers/linking'
import { colors } from 'styles/theme'
import ParentCryptoCurrencyIcon from '../ParentCryptoCurrencyIcon'

const CurName = styled(Text).attrs(() => ({
  ff: 'Inter|SemiBold',
  fontSize: 2,
}))`
  text-transform: uppercase;
  letter-spacing: 1px;
`

const CurNameToken = styled(Text).attrs(() => ({
  ff: 'Inter|Bold',
  fontSize: 2,
}))``

const CurNameTokenLink = styled(CurNameToken)`
  margin-left: 5px;
  padding: 2px 4px;
  border-radius: ${p => p.theme.radii[1]}px;
`

const CurNameTokenIcon = styled(Text).attrs(() => ({
  ff: 'Inter|SemiBold',
  fontSize: 2,
}))`
  color: ${colors.wallet};
  display: none;
  margin-left: 5px;
  align-items: center;
`

const Wrapper = styled(Box)`
  cursor: pointer;
  display: flex;
  align-items: center;

  :hover ${CurNameTokenIcon} {
    display: flex;
  }

  :hover ${CurNameTokenLink} {
    color: ${colors.wallet};
    background-color: ${colors.pillActiveBackground};
  }
`

const AccountName = styled(Text).attrs(() => ({
  color: 'palette.text.shade100',
  ff: 'Inter|SemiBold',
  fontSize: 7,
}))``

type Props = {
  account: AccountLike,
  parentAccount: ?Account,
}

const AccountHeader: React$ComponentType<Props> = React.memo(
  ({ account, parentAccount }: Props) => {
    const currency = getAccountCurrency(account)
    const mainAccount = getMainAccount(account, parentAccount)
    const explorerView = getDefaultExplorerView(mainAccount.currency)

    const getContract = () =>
      account.type === 'TokenAccount' && parentAccount
        ? getAccountContractExplorer(explorerView, account, parentAccount)
        : null

    const contract = getContract()

    const openLink = useCallback(() => {
      if (contract) {
        openURL(contract)
      }
    }, [contract])

    return (
      <Box horizontal align="center" flow={2} grow>
        <Box>
          <ParentCryptoCurrencyIcon currency={currency} bigger />
        </Box>
        <Box grow>
          {contract && account.type === 'TokenAccount' ? (
            <Box horizontal alignItems="center">
              <CurNameToken>
                <Trans i18nKey="account.contractAddress" />
              </CurNameToken>
              <Wrapper horizontal alignItems="center" onClick={openLink}>
                <CurNameTokenLink>
                  {shortAddressPreview(account.token.contractAddress)}
                </CurNameTokenLink>
                <CurNameTokenIcon>
                  <ExternalLink size={12} style={{ marginRight: 5 }} />
                  <Trans i18nKey="account.openInExplorer" />
                </CurNameTokenIcon>
              </Wrapper>
            </Box>
          ) : (
            <CurName>{currency.name}</CurName>
          )}
          <AccountName>
            <Ellipsis>{getAccountName(account)}</Ellipsis>
          </AccountName>
        </Box>
      </Box>
    )
  },
)

export default AccountHeader

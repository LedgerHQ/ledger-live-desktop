// @flow

import React, { useCallback, useMemo } from 'react'
import styled from 'styled-components'
import moment from 'moment'
import { Trans } from 'react-i18next'

import {
  getMainAccount,
  getAccountUnit,
  getAccountCurrency,
  shortAddressPreview,
} from '@ledgerhq/live-common/lib/account'
import {
  getDefaultExplorerView,
  getTransactionExplorer,
  getAddressExplorer,
} from '@ledgerhq/live-common/lib/explorers'
import type { Account, AccountLike } from '@ledgerhq/live-common/lib/types'
import type { Delegation } from '@ledgerhq/live-common/lib/families/tezos/bakers'

import { openURL } from 'helpers/linking'
import CounterValue from 'components/CounterValue'
import FormattedVal from 'components/base/FormattedVal'
import Text from 'components/base/Text'
import Ellipsis from 'components/base/Ellipsis'
import ContextMenu from './ContextMenu'

type Props = {
  delegation: Delegation,
  account: AccountLike,
  parentAccount: ?Account,
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 16px 20px;
  > * {
    display: flex;
    align-items: center;
    flex-direction: row;
    box-sizing: border-box;
  }

  &:hover {
    background: ${p => p.theme.colors.palette.background.default};
  }
`

const Baker = styled.div`
  flex: 1.5;
  color: ${p => p.theme.colors.palette.text.shade100};
  > :first-child {
    padding-right: 6px;
  }

  > :nth-child(2),
  > :only-child {
    padding-right: 8px;
  }

  cursor: pointer;
`

const Logo = styled.img`
  width: 24px;
  height: 24px;
`

const Address = styled.div`
  user-select: pointer;
  flex: 1.5;
  > :first-child {
    margin-right: 8px;
  }
`

const Base = styled.div`
  flex: 1;
  > :first-child {
    margin-right: 6px;
  }
`

const CTA = styled.div`
  flex: 0.5;
  display: flex;
  justify-content: flex-end;
`

const Row = ({ account, parentAccount, delegation }: Props) => {
  const unit = getAccountUnit(account)
  const currency = getAccountCurrency(account)

  const mainAccount = getMainAccount(account, parentAccount)

  const name = delegation.baker ? delegation.baker.name : shortAddressPreview(delegation.address)

  const imgSrc = delegation.baker ? delegation.baker.logoURL : null

  const diffInDays = useMemo(() => moment().diff(delegation.operation.date, 'days'), [
    delegation.operation.date,
  ])

  const bakerAddress = delegation.baker
    ? delegation.baker.address
    : delegation.operation.recipients[0]

  const explorerView = getDefaultExplorerView(mainAccount.currency)
  const bakerURL = getAddressExplorer(explorerView, bakerAddress)
  const txURL = getTransactionExplorer(explorerView, delegation.operation.hash)

  const openBaker = useCallback(() => {
    if (bakerURL) openURL(bakerURL)
  }, [bakerURL])

  const openTx = useCallback(() => {
    if (txURL) openURL(txURL)
  }, [txURL])

  return (
    <Wrapper>
      <Baker onClick={openBaker}>
        {imgSrc ? <Logo src={imgSrc} /> : null}
        <Ellipsis ff="Inter|SemiBold" color="palette.text.shade100" fontSize={3}>
          {name}
        </Ellipsis>
      </Baker>
      <Address onClick={openTx}>
        <Text ff="Inter|Medium" color="palette.primary.main" fontSize={3}>
          {shortAddressPreview(delegation.operation.hash)}
        </Text>
      </Address>
      <Base>
        <CounterValue
          alwaysShowSign={false}
          ff="Inter|SemiBold"
          color="palette.text.shade80"
          fontSize={3}
          currency={currency}
          value={account.balance}
        />
      </Base>
      <Base>
        <FormattedVal
          ff="Inter|SemiBold"
          val={account.balance}
          unit={unit}
          showCode
          fontSize={3}
          color="palette.text.shade80"
        />
      </Base>
      <Base>
        <Text ff="Inter|Medium" color="palette.text.shade80" fontSize={3}>
          <Text style={{ paddingLeft: '4px' }}>
            {diffInDays ? (
              <Trans
                i18nKey="delegation.durationDays"
                count={diffInDays}
                values={{ count: diffInDays }}
              />
            ) : (
              <Trans i18nKey="delegation.durationJustStarted" />
            )}
          </Text>
        </Text>
      </Base>
      <CTA>
        <ContextMenu account={account} parentAccount={parentAccount} />
      </CTA>
    </Wrapper>
  )
}

export default Row

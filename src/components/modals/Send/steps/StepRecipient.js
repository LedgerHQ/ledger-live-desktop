// @flow

import React, { PureComponent, Fragment } from 'react'
import { getMainAccount } from '@ledgerhq/live-common/lib/account'
import TrackPage from 'analytics/TrackPage'
import styled from 'styled-components'
import Box from 'components/base/Box'
import Button from 'components/base/Button'
import Label from 'components/base/Label'
import SelectAccount from 'components/SelectAccount'
import CurrencyDownStatusAlert from 'components/CurrencyDownStatusAlert'
import IconArrowDown from 'icons/ArrowDown'
import RecipientField from '../fields/RecipientField'
import ErrorBanner from '../../../ErrorBanner'
import type { StepProps } from '../types'
import SendRecipientFields, { getFields } from '../SendRecipientFields'

const Separator = styled.div`
  display: flex;
  align-items: center;
  & > div {
    flex: 1;
    height: 1px;
    background: ${p => p.theme.colors.palette.divider};
    & :nth-of-type(2) {
      color: ${p => p.theme.colors.palette.primary.main};
      flex: unset;
      display: flex;
      align-items: center;
      height: 36px;
      width: 36px;
      border-radius: 36px;
      background: transparent;
      justify-content: center;
      border: 1px solid ${p => p.theme.colors.palette.divider};
    }
  }
`

export default ({
  t,
  account,
  parentAccount,
  openedFromAccount,
  transaction,
  onChangeAccount,
  onChangeTransaction,
  error,
  status,
  bridgePending,
}: StepProps) => {
  if (!status) return null
  const mainAccount = account ? getMainAccount(account, parentAccount) : null

  return (
    <Box flow={4}>
      <TrackPage category="Send Flow" name="Step 1" />
      {mainAccount ? <CurrencyDownStatusAlert currency={mainAccount.currency} /> : null}
      {error ? <ErrorBanner error={error} /> : null}
      <Box flow={1}>
        <Label>{t('send.steps.details.selectAccountDebit')}</Label>
        <SelectAccount
          withSubAccounts
          enforceHideEmptySubAccounts
          autoFocus={!openedFromAccount}
          onChange={onChangeAccount}
          value={account}
        />
      </Box>
      <Separator>
        <div />
        <div>
          <IconArrowDown size={16} />
        </div>
        <div />
      </Separator>
      {account && transaction && mainAccount && (
        <>
          <RecipientField
            status={status}
            autoFocus={openedFromAccount}
            account={mainAccount}
            transaction={transaction}
            onChangeTransaction={onChangeTransaction}
            bridgePending={bridgePending}
            t={t}
          />
          <SendRecipientFields
            account={mainAccount}
            status={status}
            transaction={transaction}
            onChange={onChangeTransaction}
          />
        </>
      )}
    </Box>
  )
}

export class StepRecipientFooter extends PureComponent<StepProps> {
  onNext = async () => {
    const { transitionTo } = this.props
    transitionTo('amount')
  }

  render() {
    const { t, account, parentAccount, status, bridgePending } = this.props
    const { errors } = status

    const mainAccount = account ? getMainAccount(account, parentAccount) : null

    const isTerminated = mainAccount && mainAccount.currency.terminated
    const fields = ['recipient'].concat(mainAccount ? getFields(mainAccount) : [])
    const hasFieldError = Object.keys(errors).some(name => fields.includes(name))
    const canNext = !bridgePending && !hasFieldError && !isTerminated

    return (
      <Fragment>
        <Button isLoading={bridgePending} primary disabled={!canNext} onClick={this.onNext}>
          {t('common.continue')}
        </Button>
      </Fragment>
    )
  }
}

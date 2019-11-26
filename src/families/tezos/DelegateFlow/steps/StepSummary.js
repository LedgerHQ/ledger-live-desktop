// @flow

import invariant from 'invariant'
import React from 'react'
import styled from 'styled-components'
import {
  // shortAddressPreview,
  getAccountCurrency,
  getAccountName,
  getAccountUnit,
} from '@ledgerhq/live-common/lib/account'
import { useBaker, useDelegation } from '@ledgerhq/live-common/lib/families/tezos/bakers'
import type { Baker } from '@ledgerhq/live-common/lib/families/tezos/bakers'
import { Trans } from 'react-i18next'

import TrackPage from 'analytics/TrackPage'
import Box from 'components/base/Box'
import Text from 'components/base/Text'
import FormattedVal from 'components/base/FormattedVal'
import CryptoCurrencyIcon from 'components/CryptoCurrencyIcon'
import Button from 'components/base/Button'
import Ellipsis from 'components/base/Ellipsis'
import TranslatedError from 'components/TranslatedError'

import BakerImage from '../../BakerImage'
import DelegationContainer from './../DelegationContainer'

import type { StepProps } from '../types'

const Container = styled(Box)`
  width: 148px;
  padding: 24px;
  border: 1px solid ${p => p.theme.colors.palette.text.shade20};
  border-radius: 4px;
  align-items: center;
  justify-content: center;

  & > * {
    margin-bottom: 4px;
  }

  & > :first-child {
    margin-bottom: 10px;
  }
`

const Placeholder = styled(Box)`
  height: 14px;
`

const StepSummary = ({ account, transaction, transitionTo, isRandomChoice }: StepProps) => {
  invariant(
    account && transaction && transaction.family === 'tezos',
    'step summary requires account and transaction settled',
  )
  const delegation = useDelegation(account)
  const baker = useBaker(transaction.recipient)
  const currency = getAccountCurrency(account)
  const unit = getAccountUnit(account)

  // const bakerName = baker ? baker.name : shortAddressPreview(transaction.recipient)
  const getBakerName = (baker: ?Baker, fallback: string) => (baker ? baker.name : fallback)

  return (
    <Box flow={4} mx={40}>
      <TrackPage category="Delegation Flow" name="Step Summary" />

      <DelegationContainer
        undelegation={transaction.mode === 'undelegate'}
        left={
          <Box>
            <Text ff="Inter|Medium" color="palette.text.shade60" fontSize={3}>
              <Trans
                i18nKey={`delegation.flow.steps.summary.${
                  transaction.mode === 'delegate' ? 'toDelegate' : 'toUndelegate'
                }`}
              />
            </Text>
            <Container mt={1}>
              <CryptoCurrencyIcon size={32} currency={currency} />
              <Ellipsis>
                <Text ff="Inter|SemiBold" color="palette.text.shade100" fontSize={3}>
                  {getAccountName(account)}
                </Text>
              </Ellipsis>
              <FormattedVal
                color={'palette.text.shade60'}
                disableRounding
                unit={unit}
                val={account.balance}
                fontSize={3}
                inline
                showCode
              />
            </Container>
          </Box>
        }
        right={
          transaction.mode === 'delegate' ? (
            <Box>
              <Box horizontal justifyContent="space-between">
                <Text ff="Inter|Medium" color="palette.text.shade60" fontSize={3}>
                  <Trans i18nKey="delegation.flow.steps.summary.validator" />
                </Text>
                <Text
                  ff="Inter|SemiBold"
                  color="palette.primary.main"
                  fontSize={3}
                  onClick={/* quick hack */ () => transitionTo('validator')}
                  style={{ cursor: 'pointer' }}
                >
                  <Trans i18nKey="common.choose" />
                </Text>
              </Box>
              <Container my={1}>
                <BakerImage size={32} baker={baker} />
                <Ellipsis>
                  <Text ff="Inter|SemiBold" color="palette.text.shade100" fontSize={3}>
                    {getBakerName(baker, transaction.recipient)}
                  </Text>
                </Ellipsis>
                {baker ? (
                  <Text ff="Inter|SemiBold" color="palette.text.shade60" fontSize={3}>
                    <Trans
                      i18nKey="delegation.flow.steps.summary.yield"
                      values={{ amount: baker.nominalYield }}
                    />
                  </Text>
                ) : (
                  <Placeholder />
                )}
              </Container>

              {isRandomChoice ? (
                <Text ff="Inter|Medium" color="palette.text.shade60" fontSize={2}>
                  <Trans i18nKey="delegation.flow.steps.summary.randomly" />
                </Text>
              ) : null}
            </Box>
          ) : delegation ? (
            <Box>
              <Box horizontal justifyContent="space-between">
                <Text ff="Inter|Medium" color="palette.text.shade60" fontSize={3}>
                  <Trans i18nKey="delegation.flow.steps.summary.validator" />
                </Text>
              </Box>
              <Container my={1}>
                <BakerImage size={32} baker={delegation.baker} />
                <Ellipsis>
                  <Text ff="Inter|SemiBold" color="palette.text.shade100" fontSize={3}>
                    {getBakerName(delegation.baker, delegation.address)}
                  </Text>
                </Ellipsis>
                {delegation.baker ? (
                  <Text ff="Inter|SemiBold" color="palette.text.shade60" fontSize={3}>
                    <Trans
                      i18nKey="delegation.flow.steps.summary.yield"
                      values={{ amount: delegation.baker.nominalYield }}
                    />
                  </Text>
                ) : null}
              </Container>
            </Box>
          ) : null
        }
      />
    </Box>
  )
}

export default StepSummary

export const StepSummaryFooter = ({
  t,
  account,
  bridgeError,
  status,
  bridgePending,
  transitionTo,
}: StepProps) => {
  if (!account) return null
  const error = bridgeError || Object.values(status.errors)[0]
  const canNext = !bridgePending && !error
  return (
    <Box horizontal alignItems="center" flow={2}>
      <Text fontSize={13} color="alertRed">
        <TranslatedError error={error} field="title" />
      </Text>
      <Button
        primary
        isLoading={bridgePending}
        disabled={!canNext}
        onClick={() => transitionTo('device')}
      >
        {t('common.continue')}
      </Button>
    </Box>
  )
}

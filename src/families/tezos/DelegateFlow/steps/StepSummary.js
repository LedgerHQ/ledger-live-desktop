// @flow

import invariant from 'invariant'
import React, { useState } from 'react'
import styled from 'styled-components'
import {
  shortAddressPreview,
  getAccountCurrency,
  getAccountName,
  getAccountUnit,
} from '@ledgerhq/live-common/lib/account'
import { useBaker, useDelegation } from '@ledgerhq/live-common/lib/families/tezos/bakers'
import { Trans } from 'react-i18next'

import TrackPage from 'analytics/TrackPage'
import Box from 'components/base/Box'
import Text from 'components/base/Text'
import FormattedVal from 'components/base/FormattedVal'
import CryptoCurrencyIcon from 'components/CryptoCurrencyIcon'
import Button from 'components/base/Button'
import Ellipsis from 'components/base/Ellipsis'

import BakerImage from '../../BakerImage'

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

const Wrapper = styled(Box).attrs(() => ({
  horizontal: true,
}))`
  justify-content: space-between;
`

const StepSummary = ({ account, transaction, transitionTo }: StepProps) => {
  invariant(account && transaction, 'step summary requires account and transaction settled')
  const [checked, setChecked] = useState(false)
  const delegation = useDelegation(account)
  const baker = useBaker(transaction.recipient)
  const currency = getAccountCurrency(account)
  const unit = getAccountUnit(account)

  const bakerName = baker ? baker.name : shortAddressPreview(transaction.recipient)

  return (
    <Box flow={4} mx={40}>
      <TrackPage category="Delegation Flow" name="Step Summary" />
      {delegation ? "there is already a delegation (so it's a change delegation)" : null}

      {transaction.mode === 'delegate' ? (
        // TODO We really need to component-ize things
        <Wrapper>
          <Box>
            <Text ff="Inter|Medium" color="palette.text.shade60" fontSize={3}>
              <Trans i18nKey="delegation.flow.steps.summary.toDelegate" />
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

          <Box>
            <Box horizontal>
              <Text ff="Inter|Medium" color="palette.text.shade60" fontSize={3}>
                <Trans i18nKey="delegation.flow.steps.summary.validator" />
              </Text>
            </Box>
            <Container my={1} onClick={/* quick hack */ () => transitionTo('validator')}>
              <BakerImage size={32} baker={baker} />
              <Ellipsis>
                <Text ff="Inter|SemiBold" color="palette.text.shade100" fontSize={3}>
                  {bakerName}
                </Text>
              </Ellipsis>
              {baker ? (
                <Text ff="Inter|SemiBold" color="palette.text.shade60" fontSize={3}>
                  <Trans
                    i18nKey="delegation.flow.steps.summary.yield"
                    values={{ amount: baker.nominalYield }}
                  />
                </Text>
              ) : null}
            </Container>

            {/* TODO only if it was not changed yet. (use a state on Body to track it?) */}
            <Text ff="Inter|Medium" color="palette.text.shade60" fontSize={2}>
              <Trans i18nKey="delegation.flow.steps.summary.randomly" />
            </Text>
          </Box>
        </Wrapper>
      ) : (
        'THIS. IS. UNDELEGATED.'
      )}
    </Box>
  )
}

export default StepSummary

// export default class StepSummary extends PureComponent<StepProps> {
//   render() {
//     const { account, parentAccount, transaction, status } = this.props
//     if (!account) return null
//     const mainAccount = getMainAccount(account, parentAccount)
//     if (!mainAccount || !transaction) return null
//     const { estimatedFees, amount, totalSpent, warnings } = status
//     const feeTooHigh = Object.keys(warnings).includes('feeTooHigh')
//     const currency = getAccountCurrency(account)
//     const feesUnit = getAccountUnit(mainAccount)
//     const unit = getAccountUnit(account)

//     return (
//       <Box flow={4} mx={40}>
//         <TrackPage category="Send Flow" name="Step Summary" />
//         <FromToWrapper>
//           <Box>
//             <Box horizontal alignItems="center">
//               <Circle>
//                 <IconWallet size={14} />
//               </Circle>
//               <div>
//                 <Text ff="Inter|Medium" color="palette.text.shade40" fontSize={4}>
//                   <Trans i18nKey="send.steps.details.from" />
//                 </Text>
//                 <Box horizontal alignItems="center">
//                   <div style={{ marginRight: 7 }}>
//                     <CryptoCurrencyIcon size={16} currency={currency} />
//                   </div>
//                   <Text ff="Inter" color="palette.text.shade100" fontSize={4}>
//                     {getAccountName(account)}
//                   </Text>
//                 </Box>
//               </div>
//             </Box>
//             <VerticalSeparator />
//             <Box horizontal alignItems="center">
//               <Circle>
//                 <IconQrCode size={14} />
//               </Circle>
//               <Box flex={1}>
//                 <Text ff="Inter|Medium" color="palette.text.shade40" fontSize={4}>
//                   <Trans i18nKey="send.steps.details.to" />
//                 </Text>
//                 <Ellipsis>
//                   <Text ff="Inter" color="palette.text.shade100" fontSize={4}>
//                     {transaction.recipient}
//                   </Text>
//                 </Ellipsis>
//               </Box>
//             </Box>
//           </Box>
//           <Separator />
//           <Box horizontal justifyContent="space-between" mb={2}>
//             <Text ff="Inter|Medium" color="palette.text.shade40" fontSize={4}>
//               <Trans i18nKey="send.steps.details.amount" />
//             </Text>
//             <FormattedVal
//               color={'palette.text.shade80'}
//               disableRounding
//               unit={unit}
//               val={amount}
//               fontSize={4}
//               inline
//               showCode
//             />
//           </Box>
//           <Box horizontal justifyContent="space-between">
//             <Text ff="Inter|Medium" color="palette.text.shade40" fontSize={4}>
//               <Trans i18nKey="send.steps.details.fees" />
//             </Text>
//             <FormattedVal
//               color={feeTooHigh ? 'warning' : 'palette.text.shade80'}
//               disableRounding
//               unit={feesUnit}
//               val={estimatedFees}
//               fontSize={4}
//               inline
//               showCode
//             />
//           </Box>
//           {feeTooHigh ? (
//             <Box horizontal justifyContent="flex-end" alignItems="center" color="warning">
//               <IconExclamationCircle size={10} />
//               <Text ff="Inter|Medium" fontSize={2} style={{ marginLeft: '5px' }}>
//                 <Trans i18nKey="send.steps.details.feesTooHigh" />
//               </Text>
//             </Box>
//           ) : null}
//           <Separator />
//           <Box horizontal justifyContent="space-between">
//             <Text ff="Inter|Medium" color="palette.text.shade40" fontSize={4}>
//               <Trans i18nKey="send.totalSpent" />
//             </Text>
//             <FormattedVal
//               color={'palette.text.shade80'}
//               disableRounding
//               unit={unit}
//               val={totalSpent}
//               fontSize={4}
//               inline
//               showCode
//             />
//           </Box>
//         </FromToWrapper>
//       </Box>
//     )
//   }
// }

export const StepSummaryFooter = ({
  t,
  account,
  status,
  bridgePending,
  transitionTo,
}: StepProps) => {
  if (!account) return null
  const { errors } = status
  const canNext = !bridgePending && !Object.keys(errors).length
  return (
    <Button primary disabled={!canNext} onClick={() => transitionTo('device')}>
      {t('common.continue')}
    </Button>
  )
}

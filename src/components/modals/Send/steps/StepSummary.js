// @flow

import React, { Fragment, PureComponent } from 'react'
import styled from 'styled-components'
import TrackPage from 'analytics/TrackPage'
import Box from 'components/base/Box'
import Text from 'components/base/Text'
import FormattedVal from 'components/base/FormattedVal'
import IconWallet from 'icons/Wallet'
import IconQrCode from 'icons/QrCode'
import {
  getAccountCurrency,
  getAccountName,
  getAccountUnit,
} from '@ledgerhq/live-common/lib/account'
import CryptoCurrencyIcon from 'components/CryptoCurrencyIcon'
import { rgba } from 'styles/helpers'
import Ellipsis from 'components/base/Ellipsis'
import Button from 'components/base/Button'
import { Trans } from 'react-i18next'
import IconExclamationCircle from 'icons/ExclamationCircle'
import colors from 'colors'
import type { StepProps } from '../types'

const FromToWrapper = styled.div``
const Circle = styled.div`
  height: 32px;
  width: 32px;
  border-radius: 32px;
  background-color: ${p => rgba(p.theme.colors.palette.primary.main, 0.1)};
  color: ${p => p.theme.colors.palette.primary.main};
  align-items: center;
  display: flex;
  justify-content: center;
  margin-right: 12px;
`
const VerticalSeparator = styled.div`
  height: 18px;
  background: ${p => p.theme.colors.palette.text.shade20};
  width: 1px;
  margin: 1px 0px 0px 15px;
`
const Separator = styled.div`
  height: 1px;
  background: ${p => p.theme.colors.palette.text.shade20};
  width: 100%;
  margin: 15px 0;
`

export default class StepSummary extends PureComponent<StepProps> {
  render() {
    const { account, transaction, status } = this.props
    if (!account || !transaction) return null
    const { estimatedFees, amount, totalSpent, warnings } = status
    const feeTooHigh = Object.keys(warnings).includes('feeTooHigh')
    const currency = getAccountCurrency(account)
    const unit = getAccountUnit(account)

    return (
      <Box flow={4} mx={40}>
        <TrackPage category="Send Flow" name="Step Summary" />
        <FromToWrapper>
          <Box>
            <Box horizontal alignItems="center">
              <Circle>
                <IconWallet size={14} />
              </Circle>
              <div>
                <Text ff="Inter|Medium" color="palette.text.shade40" fontSize={4}>
                  <Trans i18nKey="send.steps.details.from" />
                </Text>
                <Box horizontal alignItems="center">
                  <div style={{ marginRight: 7 }}>
                    <CryptoCurrencyIcon size={16} currency={currency} />
                  </div>
                  <Text ff="Inter" color="palette.text.shade100" fontSize={4}>
                    {getAccountName(account)}
                  </Text>
                </Box>
              </div>
            </Box>
            <VerticalSeparator />
            <Box horizontal alignItems="center">
              <Circle>
                <IconQrCode size={14} />
              </Circle>
              <Box flex={1}>
                <Text ff="Inter|Medium" color="palette.text.shade40" fontSize={4}>
                  <Trans i18nKey="send.steps.details.to" />
                </Text>
                <Ellipsis>
                  <Text ff="Inter" color="palette.text.shade100" fontSize={4}>
                    {transaction.recipient}
                  </Text>
                </Ellipsis>
              </Box>
            </Box>
          </Box>
          <Separator />
          <Box horizontal justifyContent="space-between" mb={2}>
            <Text ff="Inter|Medium" color="palette.text.shade40" fontSize={4}>
              <Trans i18nKey="send.steps.details.amount" />
            </Text>
            <FormattedVal
              color={'palette.text.shade80'}
              disableRounding
              unit={unit}
              val={amount}
              fontSize={4}
              inline
              showCode
            />
          </Box>
          <Box horizontal justifyContent="space-between">
            <Text ff="Inter|Medium" color="palette.text.shade40" fontSize={4}>
              <Trans i18nKey="send.steps.details.fees" />
            </Text>
            <FormattedVal
              color={feeTooHigh ? 'warning' : 'palette.text.shade80'}
              disableRounding
              unit={unit}
              val={estimatedFees}
              fontSize={4}
              inline
              showCode
            />
          </Box>
          {feeTooHigh ? (
            <Box horizontal justifyContent="flex-end" alignItems="center" color="warning">
              <IconExclamationCircle size={10} />
              <Text ff="Inter|Medium" fontSize={2} style={{ marginLeft: '5px' }}>
                <Trans i18nKey="send.steps.details.feesTooHigh" />
              </Text>
            </Box>
          ) : null}
          <Separator />
          <Box horizontal justifyContent="space-between">
            <Text ff="Inter|Medium" color="palette.text.shade40" fontSize={4}>
              <Trans i18nKey="send.totalSpent" />
            </Text>
            <FormattedVal
              color={'palette.text.shade80'}
              disableRounding
              unit={unit}
              val={totalSpent}
              fontSize={4}
              inline
              showCode
            />
          </Box>
        </FromToWrapper>
      </Box>
    )
  }
}

export class StepSummaryFooter extends PureComponent<StepProps> {
  onNext = async () => {
    const { transitionTo } = this.props
    transitionTo('device')
  }

  render() {
    const { t, account, status, bridgePending } = this.props
    if (!account) return null
    const { amount, errors } = status
    const canNext = amount.gt(0) && !bridgePending && !Object.keys(errors).length
    return (
      <Fragment>
        <Button primary disabled={!canNext} onClick={this.onNext}>
          {t('common.continue')}
        </Button>
      </Fragment>
    )
  }
}

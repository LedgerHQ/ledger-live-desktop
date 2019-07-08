// @flow

import React, { Fragment, useMemo } from 'react'
import styled from 'styled-components'
import { Trans } from 'react-i18next'
import { listSupportedCurrencies, listTokens } from '@ledgerhq/live-common/lib/currencies'

import { colors } from 'styles/theme'
import { useWithTokens } from 'helpers/experimental'
import TrackPage from 'analytics/TrackPage'
import SelectCurrency from 'components/SelectCurrency'
import InfoCircle from 'icons/InfoCircle'
import Button from 'components/base/Button'
import Box from 'components/base/Box'
import Text from 'components/base/Text'
import CurrencyDownStatusAlert from 'components/CurrencyDownStatusAlert'
import CurrencyBadge from 'components/base/CurrencyBadge'

import type { StepProps } from '../index'

const TokenTipsContainer = styled(Box)`
  background: ${colors.pillActiveBackground};
  color: ${colors.wallet};
  font-weight: 400;
  padding: 16px;
`

const TokenTips = React.memo(() => (
  <TokenTipsContainer mt={4} horizontal alignItems="center">
    <InfoCircle size={16} color={colors.wallet} />
    <Text style={{ flex: 1, marginLeft: 20 }} ff="Open Sans|Regular" fontSize={4}>
      <Trans i18nKey="to.do">
        {'To add this ERC20 token, you need to '}
        <Text ff="Open Sans|SemiBold">{'add an Ethereum account'}</Text>
        {' then open it and click on the "'}
        <Text ff="Open Sans|SemiBold">{'Add token'}</Text>
        {'" button'}
      </Trans>
    </Text>
  </TokenTipsContainer>
))

function StepChooseCurrency({ currency, setCurrency }: StepProps) {
  const withTokens = useWithTokens()
  const currencies = useMemo(
    () => listSupportedCurrencies().concat(withTokens ? listTokens() : []),
    [withTokens],
  )
  return (
    <Fragment>
      {currency ? <CurrencyDownStatusAlert currency={currency} /> : null}
      <SelectCurrency currencies={currencies} autoFocus onChange={setCurrency} value={currency} />
      {currency && currency.type === 'TokenCurrency' ? <TokenTips /> : null}
    </Fragment>
  )
}

export function StepChooseCurrencyFooter({ transitionTo, currency, t }: StepProps) {
  return (
    <Fragment>
      <TrackPage category="AddAccounts" name="Step1" />
      {currency && <CurrencyBadge mr="auto" currency={currency} />}
      <Button
        primary
        disabled={!currency || currency.type === 'TokenCurrency'}
        onClick={() => transitionTo('connectDevice')}
      >
        {t('common.continue')}
      </Button>
    </Fragment>
  )
}

export default StepChooseCurrency

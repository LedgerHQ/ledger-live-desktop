// @flow

import React, { Fragment, useMemo } from 'react'
import styled from 'styled-components'
import { Trans } from 'react-i18next'
import { listSupportedCurrencies, listTokens } from '@ledgerhq/live-common/lib/currencies'

import { colors } from 'styles/theme'
import TrackPage from 'analytics/TrackPage'
import { urls } from 'config/urls'
import SelectCurrency from 'components/SelectCurrency'
import InfoCircle from 'icons/InfoCircle'
import Button from 'components/base/Button'
import ExternalLinkButton from 'components/base/ExternalLinkButton'
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

const TokenTips = React.memo(({ currency }: *) => (
  <TokenTipsContainer mt={4} horizontal alignItems="center">
    <InfoCircle size={16} color={colors.wallet} />
    <Text style={{ flex: 1, marginLeft: 20 }} ff="Inter|Regular" fontSize={4}>
      <Trans
        i18nKey="addAccounts.tokensTip"
        values={{
          token: currency.name,
          ticker: currency.ticker,
          tokenType: currency.tokenType.toUpperCase(),
          currency: currency.parentCurrency.name,
        }}
      />
    </Text>
  </TokenTipsContainer>
))

function StepChooseCurrency({ currency, setCurrency }: StepProps) {
  const currencies = useMemo(() => listSupportedCurrencies().concat(listTokens()), [])
  return (
    <Fragment>
      {currency ? <CurrencyDownStatusAlert currency={currency} /> : null}
      <SelectCurrency currencies={currencies} autoFocus onChange={setCurrency} value={currency} />
      {currency && currency.type === 'TokenCurrency' ? <TokenTips currency={currency} /> : null}
    </Fragment>
  )
}

export function StepChooseCurrencyFooter({ transitionTo, currency, t }: StepProps) {
  return (
    <Fragment>
      <TrackPage category="AddAccounts" name="Step1" />
      {currency && <CurrencyBadge mr="auto" currency={currency} />}
      {currency && currency.type === 'TokenCurrency' ? (
        <ExternalLinkButton
          primary
          event="More info on Manage ERC20 tokens"
          url={urls.managerERC20}
          label={t('common.learnMore')}
        />
      ) : (
        <Button primary disabled={!currency} onClick={() => transitionTo('connectDevice')}>
          {t('common.continue')}
        </Button>
      )}
    </Fragment>
  )
}

export default StepChooseCurrency

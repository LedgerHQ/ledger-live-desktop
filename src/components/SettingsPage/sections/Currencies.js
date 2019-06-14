// @flow

import React, { PureComponent } from 'react'
import { Trans, translate } from 'react-i18next'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { createStructuredSelector } from 'reselect'
import type { CryptoCurrency } from '@ledgerhq/live-common/lib/types'
import type { Currency } from '@ledgerhq/live-common/src/types'
import type { T } from 'types/common'
import { cryptoCurrenciesSelector } from 'reducers/accounts'
import IconCurrencies from 'icons/Currencies'
import IconActivity from 'icons/Activity'
import IconInfoCircle from 'icons/InfoCircle'
import IconAngleDown from 'icons/AngleDown'
import TrackPage from 'analytics/TrackPage'
import SelectCurrency from 'components/SelectCurrency'
import Text from 'components/base/Text'

import {
  counterValueExchangeSelector,
  counterValueCurrencySelector,
  intermediaryCurrency,
} from 'reducers/settings'

import Box from 'components/base/Box'
import CurrencyRows from './CurrencyRows'
import RateRow, { RateRowWrapper } from '../RateRow'
import {
  SettingsSection as Section,
  SettingsSectionHeader as Header,
  SettingsSectionBody as Body,
  SettingsSectionRow as Row,
} from '../SettingsSection'
import Tooltip from '../../base/Tooltip'

const Wrapper = styled.div`
  > ${Section} {
    &:first-of-type {
      margin-bottom: 16px;
    }
  }
`

type Props = {
  currencies: CryptoCurrency[],
  counterValueCurrency: Currency,
  counterValueExchange: string,
  t: T,
}

type State = {
  currency: CryptoCurrency,
  sectionVisible: boolean,
}

const mapStateToProps = createStructuredSelector({
  currencies: cryptoCurrenciesSelector,
  counterValueCurrency: counterValueCurrencySelector,
  counterValueExchange: counterValueExchangeSelector,
})

const Circle = styled.div`
  height: ${p => p.size}px;
  width: ${p => p.size}px;
  border-radius: ${p => p.size}px;
  background-color: ${p => p.theme.colors[p.color]};
`

const RateTooltipWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  > ${Circle} {
    margin-right: 4px;
  }
  > ${Circle}:not(:first-of-type) {
    margin-left: 16px;
  }
`

const TooltipButtonWrapper = styled.div`
  color: ${p => p.theme.colors.grey};
  margin-left: 8px;
  display: flex;
  align-items: center;
`

const Show = styled(Box)`
  transform: rotate(${p => (p.visible ? 180 : 0)}deg);
`

const RateTooltip = () => (
  <RateTooltipWrapper>
    <Circle size={8} color="wallet" />
    <Text>
      <Trans i18nKey="settings.rates.cryptoToFiat" />
    </Text>
    <Circle size={8} color="identity" />
    <Text>
      <Trans i18nKey="settings.rates.cryptoToCrypto" />
    </Text>
  </RateTooltipWrapper>
)

class TabCurrencies extends PureComponent<Props, State> {
  state = {
    currency: this.props.currencies[0],
    sectionVisible: false,
  }

  handleChangeCurrency = (currency: CryptoCurrency) => this.setState({ currency })

  toggleCurrencySection = () =>
    this.setState(prevState => ({ sectionVisible: !prevState.sectionVisible }))

  render() {
    const { currency, sectionVisible } = this.state
    if (!currency) return null // this case means there is no accounts
    const { t, currencies, counterValueExchange, counterValueCurrency } = this.props

    return (
      <Wrapper>
        <TrackPage category="Settings" name="Currencies" />
        <Section key={currency.id}>
          <TrackPage category="Settings" name="Currencies" currencyId={currency.id} />
          <Header
            icon={<IconCurrencies size={16} />}
            title={t('settings.tabs.currencies')}
            desc={t('settings.currencies.desc')}
            renderRight={
              <Show visible={sectionVisible} onClick={this.toggleCurrencySection}>
                <IconAngleDown size={24} />
              </Show>
            }
          />
          {sectionVisible && (
            <Body>
              <Row desc={t('settings.currencies.select')}>
                <SelectCurrency
                  small
                  minWidth={200}
                  value={currency}
                  onChange={this.handleChangeCurrency}
                  currencies={currencies}
                />
              </Row>
              <CurrencyRows currency={currency} />
            </Body>
          )}
        </Section>
        <Section key={'rates'}>
          <Header
            icon={<IconActivity size={16} />}
            title={t('settings.tabs.rates')}
            desc={t('settings.rates.desc')}
          />
          <Body>
            <RateRowWrapper>
              <Box ff="Open Sans|SemiBold" alignItems="center" horizontal color="dark" fontSize={4}>
                {'Rate'}
                <TooltipButtonWrapper>
                  <Tooltip render={RateTooltip}>
                    <IconInfoCircle size={12} />
                  </Tooltip>
                </TooltipButtonWrapper>
              </Box>
              <Box ff="Open Sans|SemiBold" color="dark" fontSize={4}>
                {'Price'}
              </Box>
              <Box ff="Open Sans|SemiBold" color="dark" fontSize={4}>
                {'Last 30 days'}
              </Box>
              <Box ff="Open Sans|SemiBold" color="dark" fontSize={4}>
                {'Exchange'}
              </Box>
            </RateRowWrapper>
            <RateRow
              from={intermediaryCurrency}
              to={counterValueCurrency}
              exchangeId={counterValueExchange}
            />
            {currencies
              .filter(c => c !== intermediaryCurrency)
              .map(from => (
                <RateRow key={from.id} from={from} to={intermediaryCurrency} />
              ))}
          </Body>
        </Section>
      </Wrapper>
    )
  }
}

export default translate()(connect(mapStateToProps)(TabCurrencies))

// @flow

import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { createStructuredSelector } from 'reselect'
import type { CryptoCurrency } from '@ledgerhq/live-common/lib/types'
import type { T } from 'types/common'
import { cryptoCurrenciesSelector } from 'reducers/accounts'
import IconCurrencies from 'icons/Currencies'
import IconAngleDown from 'icons/AngleDown'
import TrackPage from 'analytics/TrackPage'
import SelectCurrency from 'components/SelectCurrency'
import Box from 'components/base/Box'
import CurrencyRows from './CurrencyRows'
import {
  SettingsSection as Section,
  SettingsSectionHeader as Header,
  SettingsSectionBody as Body,
  SettingsSectionRow as Row,
} from '../../SettingsSection'

type Props = {
  currencies: CryptoCurrency[],
  t: T,
}

type State = {
  currency: CryptoCurrency,
  sectionVisible: boolean,
}

const mapStateToProps = createStructuredSelector({
  currencies: cryptoCurrenciesSelector,
})

const Show = styled(Box)`
  transform: rotate(${p => (p.visible ? 180 : 0)}deg);
`

class Currencies extends PureComponent<Props, State> {
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
    const { t, currencies } = this.props
    return (
      <Section key={currency.id}>
        <TrackPage category="Settings" name="Currencies" currencyId={currency.id} />
        <Header
          icon={<IconCurrencies size={16} />}
          title={t('settings.tabs.currencies')}
          desc={t('settings.currencies.desc')}
          renderRight={
            <Show visible={sectionVisible}>
              <IconAngleDown size={24} />
            </Show>
          }
          onClick={this.toggleCurrencySection}
          style={{ cursor: 'pointer' }}
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
    )
  }
}

export default translate()(connect(mapStateToProps)(Currencies))

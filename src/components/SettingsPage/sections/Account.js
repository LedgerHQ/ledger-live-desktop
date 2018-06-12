// @flow

import React, { PureComponent } from 'react'
import moment from 'moment'
import { listFiatCurrencies } from '@ledgerhq/live-common/lib/helpers/currencies'

import type { Settings, T } from 'types/common'

import Select from 'components/base/Select'
import RadioGroup from 'components/base/RadioGroup'
import IconAccount from 'icons/Account'


import {
  SettingsSection as Section,
  SettingsSectionHeader as Header,
  SettingsSectionBody as Body,
  SettingsSectionRow as Row,
} from '../SettingsSection'

const fiats = listFiatCurrencies()
  .map(f => f.units[0])
  // For now we take first unit, in the future we'll need to figure out something else
  .map(fiat => ({
    key: fiat.code,
    fiat,
    name: `${fiat.name} - ${fiat.code}${fiat.symbol ? ` (${fiat.symbol})` : ''}`,
  }))

type Props = {
  t: T,
  settings: Settings,
  saveSettings: Function,
  i18n: Object,
}

type State = {
  cachedMarketIndicator: string,
  cachedCounterValue: ?Object,
}

class TabProfile extends PureComponent<Props, State> {
  state = {
    cachedMarketIndicator: this.props.settings.marketIndicator,
    cachedCounterValue: fiats.find(fiat => fiat.fiat.code === this.props.settings.counterValue),
  }

  getMarketIndicators() {
    const { t } = this.props
    return [
      {
        label: t('common:eastern'),
        key: 'eastern',
      },
      {
        label: t('common:western'),
        key: 'western',
      },
    ]
  }

  handleChangeCounterValue = (item: Object) => {
    const { saveSettings } = this.props
    this.setState({ cachedCounterValue: item.fiat })
    window.requestIdleCallback(() => {
      saveSettings({ counterValue: item.fiat.code })
    })
  }

  handleChangeMarketIndicator = (item: Object) => {
    const { saveSettings } = this.props
    const marketIndicator = item.key
    this.setState({
      cachedMarketIndicator: marketIndicator,
    })
    window.requestIdleCallback(() => {
      saveSettings({ marketIndicator })
    })
  }

  render() {
    const { t } = this.props
    const {
      cachedMarketIndicator,
      cachedCounterValue,
    } = this.state

    return (
      <Section>
        <Header
          icon={<IconAccount size={16} />}
          title={t('settings:tabs.account')}
          desc="Lorem ipsum dolor sit amet"
        />
        <Body>
          <Row
            title={t('settings:account.baseCurrency')}
            desc={t('settings:account.baseCurrencyDesc')}
          >
            <Select
              style={{ minWidth: 250 }}
              small
              onChange={this.handleChangeCounterValue}
              itemToString={item => (item ? item.name : '')}
              renderSelected={item => item && item.name}
              items={fiats}
              value={cachedCounterValue}
            />
          </Row>
          <Row title={t('settings:account.regionalMarketIndicator')} desc={t('settings:account.regionalMarketIndicatorDesc')}>
            <RadioGroup
              items={this.getMarketIndicators()}
              activeKey={cachedMarketIndicator}
              onChange={this.handleChangeMarketIndicator}
            />
          </Row>
        </Body>
      </Section>
    )
  }
}

export default TabProfile

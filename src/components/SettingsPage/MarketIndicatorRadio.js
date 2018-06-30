// @flow

import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'
import type { T } from 'types/common'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { setMarketIndicator } from 'actions/settings'
import { marketIndicatorSelector } from 'reducers/settings'
import RadioGroup from 'components/base/RadioGroup'

type Props = {
  t: T,
  setMarketIndicator: (*) => *,
  marketIndicator: *,
}

class MarketIndicatorRadio extends PureComponent<Props> {
  indicators = [
    {
      label: this.props.t('app:common.eastern'),
      key: 'eastern',
    },
    {
      label: this.props.t('app:common.western'),
      key: 'western',
    },
  ]

  onChange = (item: Object) => {
    const { setMarketIndicator } = this.props
    setMarketIndicator(item.key)
  }

  render() {
    const { marketIndicator } = this.props
    return (
      <RadioGroup items={this.indicators} activeKey={marketIndicator} onChange={this.onChange} />
    )
  }
}

export default translate()(
  connect(
    createStructuredSelector({ marketIndicator: marketIndicatorSelector }),
    { setMarketIndicator },
  )(MarketIndicatorRadio),
)

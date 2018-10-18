// @flow

import React, { Fragment, PureComponent } from 'react'
import { translate } from 'react-i18next'
import type { T } from 'types/common'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { setMarketIndicator } from 'actions/settings'
import { marketIndicatorSelector } from 'reducers/settings'
import RadioGroup from 'components/base/RadioGroup'
import Track from 'analytics/Track'

type Props = {
  t: T,
  setMarketIndicator: (*) => *,
  marketIndicator: *,
}

class MarketIndicatorRadio extends PureComponent<Props> {
  indicators = [
    {
      label: this.props.t('common.eastern'),
      key: 'eastern',
    },
    {
      label: this.props.t('common.western'),
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
      <Fragment>
        <Track onUpdate event="MarketIndicatorRadio" marketIndicator={marketIndicator} />
        <RadioGroup items={this.indicators} activeKey={marketIndicator} onChange={this.onChange} />
      </Fragment>
    )
  }
}

export default translate()(
  connect(
    createStructuredSelector({ marketIndicator: marketIndicatorSelector }),
    { setMarketIndicator },
  )(MarketIndicatorRadio),
)

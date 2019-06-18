// @flow

import React, { Fragment, PureComponent } from 'react'
import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { setRegion } from 'actions/settings'
import { langAndRegionSelector, counterValueCurrencySelector } from 'reducers/settings'
import type { Currency } from '@ledgerhq/live-common/lib/types'
import type { T } from 'types/common'

import Track from 'analytics/Track'
import regionsByKey from 'helpers/regions.json'
import Select from 'components/base/Select'

const regions = Object.keys(regionsByKey).map(key => {
  const [language, region] = key.split('-')
  return { value: key, language, region, label: regionsByKey[key] }
})

type Props = {
  t: T,
  counterValueCurrency: Currency,
  useSystem: boolean,
  language: string,
  region: ?string,
  setRegion: (?string) => void,
}

class RegionSelect extends PureComponent<Props> {
  handleChangeRegion = ({ region }: *) => {
    const { setRegion } = this.props
    setRegion(region)
  }

  render() {
    const { language, region } = this.props

    const regionsFiltered = regions.filter(item => language === item.language)
    const currentRegion = regionsFiltered.find(item => item.region === region) || regionsFiltered[0]

    return (
      <Fragment>
        <Track onUpdate event="RegionSelectChange" currentRegion={currentRegion.region} />
        <Select
          small
          minWidth={260}
          onChange={this.handleChangeRegion}
          renderSelected={item => item && item.name}
          value={currentRegion}
          options={regionsFiltered}
        />
      </Fragment>
    )
  }
}

export default connect(
  createSelector(
    langAndRegionSelector,
    counterValueCurrencySelector,
    (langAndRegion, counterValueCurrency) => ({
      ...langAndRegion,
      counterValueCurrency,
    }),
  ),
  {
    setRegion,
  },
)(RegionSelect)

// @flow
import React from 'react'
import GasLimitField from './GasLimitField'
import GasPriceField from './GasPriceField'

export default (props: *) => (
  <>
    <GasPriceField {...props} />
    <GasLimitField {...props} />
  </>
)

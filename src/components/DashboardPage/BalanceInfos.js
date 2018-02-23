// @flow

import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { getDefaultUnitByCoinType } from '@ledgerhq/currencies'

import type { MapStateToProps } from 'react-redux'

import { getTotalBalance } from 'reducers/accounts'

import Box from 'components/base/Box'
import Text from 'components/base/Text'
import FormattedVal from 'components/base/FormattedVal'

const mapStateToProps: MapStateToProps<*, *, *> = state => ({
  totalBalance: getTotalBalance(state),
})

type Props = {
  totalBalance: number,
}

const Sub = styled(Text).attrs({
  ff: 'Open Sans',
  color: 'graphite',
  fontSize: 4,
})``

function BalanceInfos(props: Props) {
  const { totalBalance } = props
  return (
    <Box horizontal alignItems="flex-end" flow={7}>
      <Box grow>
        <FormattedVal
          val={totalBalance}
          unit={getDefaultUnitByCoinType(0)}
          alwaysShowSign={false}
          showCode
          fontSize={8}
          color="dark"
          style={{ lineHeight: 1 }}
        />
        <Sub>{'Total balance'}</Sub>
      </Box>
      <Box alignItems="flex-end">
        <FormattedVal isPercent val={9.25} alwaysShowSign fontSize={7} />
        <Sub>{'since one week'}</Sub>
      </Box>
      <Box alignItems="flex-end">
        <FormattedVal fiat="USD" alwaysShowSign showCode val={6132.23} fontSize={7} />
        <Sub>{'since one week'}</Sub>
      </Box>
    </Box>
  )
}

export default connect(mapStateToProps)(BalanceInfos)

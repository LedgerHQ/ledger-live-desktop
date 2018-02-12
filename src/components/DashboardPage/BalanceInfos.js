// @flow

import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'

import type { MapStateToProps } from 'react-redux'

import { formatBTC } from 'helpers/format'
import { getTotalBalance } from 'reducers/accounts'

import Box from 'components/base/Box'
import Text from 'components/base/Text'

const mapStateToProps: MapStateToProps<*, *, *> = state => ({
  totalBalance: getTotalBalance(state),
})

type Props = {
  totalBalance: number,
}

const Sub = styled(Text).attrs({
  ff: 'Open Sans',
  color: 'warmGrey',
  fontSize: 4,
})``

function BalanceInfos(props: Props) {
  const { totalBalance } = props
  return (
    <Box horizontal align="flex-end" flow={7}>
      <Box grow>
        <Text ff="Rubik" fontSize={8} color="dark" style={{ lineHeight: 1 }}>
          {formatBTC(totalBalance, {
            alwaysShowSign: false,
            showCode: true,
          })}
        </Text>
        <Sub>{'Total balance'}</Sub>
      </Box>
      <Box align="flex-end">
        <Text>{'+9.25%'}</Text>
        <Sub>{'Since one week'}</Sub>
      </Box>
      <Box align="flex-end">
        <Text>{'+ USD 6,132.23'}</Text>
        <Sub>{'Since one week'}</Sub>
      </Box>
    </Box>
  )
}

export default connect(mapStateToProps)(BalanceInfos)

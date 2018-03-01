// @flow

import React from 'react'
import styled from 'styled-components'

import Box from 'components/base/Box'
import Text from 'components/base/Text'
import FormattedVal from 'components/base/FormattedVal'

type Props = {
  fiat: string,
  since: string,
  totalBalance: number,
  sinceBalance: number,
}

const Sub = styled(Text).attrs({
  ff: 'Open Sans',
  color: 'warnGrey',
  fontSize: 4,
})``

function BalanceInfos(props: Props) {
  const { fiat, totalBalance, since, sinceBalance } = props
  return (
    <Box horizontal alignItems="flex-end" flow={7}>
      <Box grow>
        <FormattedVal
          fiat={fiat}
          val={totalBalance}
          alwaysShowSign={false}
          showCode
          fontSize={8}
          color="dark"
          style={{ lineHeight: 1 }}
        />
        <Sub>{'Total balance'}</Sub>
      </Box>
      <Box alignItems="flex-end">
        <FormattedVal
          isPercent
          val={Math.floor((totalBalance - sinceBalance) / sinceBalance * 100)}
          alwaysShowSign
          fontSize={7}
        />
        <Sub>since one {since}</Sub>
      </Box>
      <Box alignItems="flex-end">
        <FormattedVal
          fiat="USD"
          alwaysShowSign
          showCode
          val={totalBalance - sinceBalance}
          fontSize={7}
        />
        <Sub>since one {since}</Sub>
      </Box>
    </Box>
  )
}

export default BalanceInfos

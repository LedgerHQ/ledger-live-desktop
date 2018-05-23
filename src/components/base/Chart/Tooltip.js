// @flow

import React, { Fragment } from 'react'
import styled from 'styled-components'

import type { Account } from '@ledgerhq/live-common/lib/types'

import CounterValue from 'components/CounterValue'
import FormattedVal from 'components/base/FormattedVal'
import Box from 'components/base/Box'

import type { Item } from './types'

const Container = styled(Box).attrs({
  px: 4,
  py: 3,
  align: 'center',
})`
  background: white;
  border: 1px solid #d8d8d8;
  border-radius: 4px;
  width: 150px;
  height: 90px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.03);
`

const Tooltip = ({
  item,
  renderTooltip,
  account,
}: {
  item: Item,
  renderTooltip?: Function,
  account: Account,
}) => (
  <div style={{ position: 'relative' }}>
    <div
      style={{
        position: 'absolute',
        bottom: '100%',
        left: 0,
        transform: `translate3d(-50%, 0, 0)`,
        whiteSpace: 'nowrap',
        marginBottom: -5,
      }}
    >
      <Container style={{ textAlign: 'center' }}>
        {renderTooltip ? (
          renderTooltip(item)
        ) : (
          <Fragment>
            <FormattedVal
              color="dark"
              fontSize={5}
              alwaysShowSign={false}
              showCode
              unit={account.currency.units[0]}
              val={item.value}
            />
            <CounterValue
              account={account}
              currency={account.currency}
              value={item.value}
              disableRounding
              showCode
            />
            <Box ff="Open Sans|Regular" color="grey" fontSize={3} mt="auto">
              {item.date.toISOString().substr(0, 10)}
            </Box>
          </Fragment>
        )}
      </Container>
    </div>
  </div>
)

export default Tooltip

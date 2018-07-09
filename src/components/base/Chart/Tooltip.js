// @flow

import React, { Fragment } from 'react'
import moment from 'moment'
import styled from 'styled-components'

import type { Unit, Currency } from '@ledgerhq/live-common/lib/types'

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
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.03);
`

const Tooltip = ({
  item,
  renderTooltip,
  unit,
  counterValue,
}: {
  item: Item,
  renderTooltip?: Function,
  unit?: ?Unit,
  counterValue: Currency,
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
              unit={counterValue.units[0]}
              val={item.value}
            />
            {unit && (
              <FormattedVal
                color="grey"
                fontSize={3}
                alwaysShowSign={false}
                showCode
                unit={unit}
                val={item.originalValue}
              />
            )}
            <Box ff="Open Sans|Regular" color="grey" fontSize={3} mt={2}>
              {moment(item.date).format('LL')}
            </Box>
          </Fragment>
        )}
      </Container>
    </div>
  </div>
)

export default Tooltip

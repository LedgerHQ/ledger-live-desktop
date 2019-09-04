// @flow
import React from 'react'
import { connect } from 'react-redux'
import type { Account } from '@ledgerhq/live-common/lib/types'
import { createStructuredSelector } from 'reselect'

import { activeAccountsSelector } from 'reducers/accounts'

import QRCodeExporter from './QRCodeExporter'
import Box from '../base/Box'
import ExportInstructions from './ExportInstructions'

type Props = {
  accounts?: Account[],
}

const Exporter = ({ accounts }: Props) => (
  <Box justify="center" align="center">
    <Box flow={2}>
      <QRCodeExporter accounts={accounts} size={330} />
    </Box>
    <ExportInstructions />
  </Box>
)

const mapStateToProps = createStructuredSelector({
  accounts: (state, props) => props.accounts || activeAccountsSelector(state, props),
})

export default connect(mapStateToProps)(Exporter)

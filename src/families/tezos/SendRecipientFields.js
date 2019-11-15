// @flow
import React from 'react'
import { getAccountBridge } from '@ledgerhq/live-common/lib/bridge'
import KeyboardContent from 'components/KeyboardContent'
import Box from 'components/base/Box'
import Button from 'components/base/Button'

const Mode = ({ mode, label, bridge, transaction, onChange }: *) => (
  <Button
    primary={transaction.mode === mode}
    onClick={() => onChange(bridge.updateTransaction(transaction, { mode }))}
  >
    {label}
  </Button>
)

const TemporaryDebugDelegate = ({ account, parentAccount, transaction, onChange }: *) => {
  const bridge = getAccountBridge(account, parentAccount)
  return (
    <KeyboardContent sequence="fabriiice">
      <Box horizontal flow={2}>
        <Mode
          mode="send"
          label="Send"
          bridge={bridge}
          transaction={transaction}
          onChange={onChange}
        />
        <Mode
          mode="delegate"
          label="Delegate"
          bridge={bridge}
          transaction={transaction}
          onChange={onChange}
        />
        <Mode
          mode="undelegate"
          label="Undelegate"
          bridge={bridge}
          transaction={transaction}
          onChange={onChange}
        />
      </Box>
    </KeyboardContent>
  )
}

export default {
  component: TemporaryDebugDelegate,
  fields: ['tag'],
}

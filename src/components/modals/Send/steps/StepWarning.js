// @flow
import React from 'react'
import type { Account } from '@ledgerhq/live-common/lib/types'

import byFamily from 'generated/SendWarning'

type Props = {
  account: Account,
}

export default (props: Props) => {
  const module = byFamily[props.account.currency.family]
  if (!module) return null
  const Comp = module.component

  return <Comp {...props} />
}

export const StepWarningFooter = (props: Props) => {
  const module = byFamily[props.account.currency.family]
  if (!module) return null
  const Comp = module.footer

  return <Comp {...props} />
}

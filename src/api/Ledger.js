// @flow
import type { Currency } from '@ledgerhq/live-common/lib/types'
import { LEDGER_REST_API_BASE } from 'config/constants'

export const blockchainBaseURL = ({ ledgerExplorerId }: Currency): ?string =>
  ledgerExplorerId ? `${LEDGER_REST_API_BASE}/blockchain/v2/${ledgerExplorerId}` : null

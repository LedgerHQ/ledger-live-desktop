// @flow
import type { Currency } from '@ledgerhq/live-common/lib/types'

const BASE_URL = process.env.LEDGER_REST_API_BASE || 'https://api.ledgerwallet.com/'

export const blockchainBaseURL = ({ ledgerExplorerId }: Currency): ?string =>
  ledgerExplorerId ? `${BASE_URL}blockchain/v2/${ledgerExplorerId}` : null

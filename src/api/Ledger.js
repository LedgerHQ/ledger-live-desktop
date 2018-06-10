// @flow
import type { Currency } from '@ledgerhq/live-common/lib/types'
import logger from 'logger'

const BASE_URL = process.env.LEDGER_REST_API_BASE || 'https://api.ledgerwallet.com/'

export const userFriendlyError = <A>(p: Promise<A>): Promise<A> =>
  p.catch(error => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const { data } = error.response
      if (data && typeof data.error === 'string') {
        let msg = data.error || data.message
        if (typeof msg === 'string') {
          const m = msg.match(/^JsDefined\((.*)\)$/)
          if (m) {
            try {
              const { message } = JSON.parse(m[1])
              if (typeof message === 'string') {
                msg = message
              }
            } catch (e) {
              logger.warn("can't parse server result", e)
            }
          }
          throw new Error(msg)
        }
      }
      logger.log('Ledger API: HTTP status', error.response.status, 'data: ', error.response.data)
      throw new Error('A problem occurred with Ledger API. Please try again later.')
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      throw new Error('Your network is down. Please try again later.')
    }
    throw error
  })

export const blockchainBaseURL = ({ ledgerExplorerId }: Currency): ?string =>
  ledgerExplorerId ? `${BASE_URL}blockchain/v2/${ledgerExplorerId}` : null

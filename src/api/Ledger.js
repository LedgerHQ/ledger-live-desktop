// @flow
import axios from 'axios'

const BASE_URL = process.env.LEDGER_REST_API_BASE || 'https://api.ledgerwallet.com/'

export const get = (url: string, config: *): Promise<*> =>
  axios.get(`${BASE_URL}${url}`, {
    ...config,
  })

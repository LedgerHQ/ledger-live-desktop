// @flow
import type { Dispatch } from 'redux'
import logger from 'logger'

import { getLibcorePassword } from 'reducers/libcore'
import { reloadLibcore } from 'helpers/libcoreEncryption'

export const setLibcorePassword = (password: string) => async (
  dispatch: Dispatch<*>,
  getState: Function,
) => {
  logger.log(`setLibcorePassword`, `empty: ${password ? 'no' : 'yes'}`)
  const currentLibcorePassword = getLibcorePassword(getState())

  if (password !== currentLibcorePassword) {
    dispatch({
      type: 'LIBCORE_SET_DATA',
      payload: { password },
    })
    await reloadLibcore()
  }
}

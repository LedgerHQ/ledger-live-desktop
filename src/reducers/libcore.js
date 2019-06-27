// @flow
import { handleActions } from 'redux-actions'

import type { State } from 'reducers'

export type LibcoreState = {
  password: string,
}

const INITIAL_STATE: LibcoreState = {
  password: '',
}

const handlers: Object = {
  LIBCORE_SET_DATA: (state: LibcoreState, { payload }: { payload: $Shape<LibcoreState> }) => ({
    ...state,
    ...payload,
  }),
}

export const getLibcorePassword = (state: State) => state.libcore.password

export default handleActions(handlers, INITIAL_STATE)

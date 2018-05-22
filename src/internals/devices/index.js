// @flow
import type { Command } from 'helpers/ipc'

import getAddress from './getAddress'
import listen from './listen'
import signTransaction from './signTransaction'

// TODO port these to commands
export { listen }

export const commands: Array<Command<any, any>> = [getAddress, signTransaction]

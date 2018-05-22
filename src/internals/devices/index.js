// @flow
import type { Command } from 'helpers/ipc'

import getAddress from 'commands/getAddress'
import signTransaction from 'commands/signTransaction'
import listen from './listen'

// TODO port these to commands
export { listen }

export const commands: Array<Command<any, any>> = [getAddress, signTransaction]

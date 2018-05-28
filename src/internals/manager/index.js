// @flow
import type { Command } from 'helpers/ipc'

import getMemInfo from 'commands/getMemInfo'

/**
 *                                  Manager
 *                                  -------
 *
 *                                    xXx
 *                                    xXx
 *                                    xXx
 *                                  xxxXxxx
 *                                   xxXxx
 *                                    xXx
 *                               xX    x    Xx
 *                               xX         Xx
 *                                xxXXXXXXXxx
 *
 */

export const commands: Array<Command<any, any>> = [getMemInfo]

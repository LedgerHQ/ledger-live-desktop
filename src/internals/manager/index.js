// @flow
import type { Command } from 'helpers/ipc'

import listApps from 'commands/listApps'

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

export { default as getMemInfos } from './getMemInfos'

export const commands: Array<Command<any, any>> = [listApps]

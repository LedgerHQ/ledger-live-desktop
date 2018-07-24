// @flow

// TODO we need to start porting all custom errors here.

import { createCustomErrorClass } from 'helpers/errors'

export const DisconnectedDevice = createCustomErrorClass('DisconnectedDevice')
export const UserRefusedOnDevice = createCustomErrorClass('UserRefusedOnDevice') // TODO rename because it's just for transaction refusal

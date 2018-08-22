// @flow

// TODO we need to start porting all custom errors here.

import { createCustomErrorClass } from 'helpers/errors'

export const DisconnectedDevice = createCustomErrorClass('DisconnectedDevice')
export const UserRefusedOnDevice = createCustomErrorClass('UserRefusedOnDevice') // TODO rename because it's just for transaction refusal
export const CantOpenDevice = createCustomErrorClass('CantOpenDevice')
export const DeviceAppVerifyNotSupported = createCustomErrorClass('DeviceAppVerifyNotSupported')
export const UserRefusedAddress = createCustomErrorClass('UserRefusedAddress')
export const WrongDeviceForAccount = createCustomErrorClass('WrongDeviceForAccount')
export const DeviceNotGenuineError = createCustomErrorClass('DeviceNotGenuine')
export const DeviceGenuineSocketEarlyClose = createCustomErrorClass('DeviceGenuineSocketEarlyClose')
export const TimeoutTagged = createCustomErrorClass('TimeoutTagged')
export const ETHAddressNonEIP = createCustomErrorClass('ETHAddressNonEIP')
export const CantScanQRCode = createCustomErrorClass('CantScanQRCode')

// db stuff, no need to translate
export const NoDBPathGiven = createCustomErrorClass('NoDBPathGiven')
export const DBWrongPassword = createCustomErrorClass('DBWrongPassword')

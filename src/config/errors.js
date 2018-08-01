// @flow

// TODO we need to start porting all custom errors here.

import { createCustomErrorClass } from 'helpers/errors'

export const AccountNameRequiredError = createCustomErrorClass('AccountNameRequired')
export const BtcUnmatchedApp = createCustomErrorClass('BtcUnmatchedApp')
export const CantOpenDevice = createCustomErrorClass('CantOpenDevice')
export const DeviceAppVerifyNotSupported = createCustomErrorClass('DeviceAppVerifyNotSupported')
export const DeviceGenuineSocketEarlyClose = createCustomErrorClass('DeviceGenuineSocketEarlyClose')
export const DeviceNotGenuineError = createCustomErrorClass('DeviceNotGenuine')
export const DeviceSocketFail = createCustomErrorClass('DeviceSocketFail')
export const DeviceSocketNoBulkStatus = createCustomErrorClass('DeviceSocketNoBulkStatus')
export const DeviceSocketNoHandler = createCustomErrorClass('DeviceSocketNoHandler')
export const DisconnectedDevice = createCustomErrorClass('DisconnectedDevice')
export const EnpointConfigError = createCustomErrorClass('EnpointConfig')
export const FeeEstimationFailed = createCustomErrorClass('FeeEstimationFailed')
export const HardResetFail = createCustomErrorClass('HardResetFail')
export const InvalidAddress = createCustomErrorClass('InvalidAddress')
export const LatestMCUInstalledError = createCustomErrorClass('LatestMCUInstalledError')
export const LedgerAPIError = createCustomErrorClass('LedgerAPIError')
export const LedgerAPIErrorWithMessage = createCustomErrorClass('LedgerAPIErrorWithMessage')
export const LedgerAPINotAvailable = createCustomErrorClass('LedgerAPINotAvailable')
export const ManagerAppAlreadyInstalledError = createCustomErrorClass('ManagerAppAlreadyInstalled')
export const ManagerAppRelyOnBTCError = createCustomErrorClass('ManagerAppRelyOnBTC')
export const ManagerDeviceLockedError = createCustomErrorClass('ManagerDeviceLocked')
export const ManagerNotEnoughSpaceError = createCustomErrorClass('ManagerNotEnoughSpace')
export const ManagerUninstallBTCDep = createCustomErrorClass('ManagerUninstallBTCDep')
export const NetworkDown = createCustomErrorClass('NetworkDown')
export const NoAddressesFound = createCustomErrorClass('NoAddressesFound')
export const NotEnoughBalance = createCustomErrorClass('NotEnoughBalance')
export const PasswordsDontMatchError = createCustomErrorClass('PasswordsDontMatch')
export const PasswordIncorrectError = createCustomErrorClass('PasswordIncorrect')
export const TimeoutTagged = createCustomErrorClass('TimeoutTagged')
export const UserRefusedAddress = createCustomErrorClass('UserRefusedAddress')
export const UserRefusedFirmwareUpdate = createCustomErrorClass('UserRefusedFirmwareUpdate')
export const UserRefusedOnDevice = createCustomErrorClass('UserRefusedOnDevice') // TODO rename because it's just for transaction refusal
export const WebsocketConnectionError = createCustomErrorClass('WebsocketConnectionError')
export const WebsocketConnectionFailed = createCustomErrorClass('WebsocketConnectionFailed')
export const WrongDeviceForAccount = createCustomErrorClass('WrongDeviceForAccount')

// db stuff, no need to translate
export const NoDBPathGiven = createCustomErrorClass('NoDBPathGiven')
export const DBWrongPassword = createCustomErrorClass('DBWrongPassword')

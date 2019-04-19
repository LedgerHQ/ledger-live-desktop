import { createCustomErrorClass } from '@ledgerhq/errors'

export const UpdateIncorrectHash = createCustomErrorClass('UpdateIncorrectHash')
export const UpdateIncorrectSig = createCustomErrorClass('UpdateIncorrectSig')
export const UpdateFetchFileFail = createCustomErrorClass('UpdateFetchFileFail')

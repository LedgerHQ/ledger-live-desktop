// @flow
import { ipcRenderer } from 'electron'
import { setEnvUnsafe, getEnv, getAllEnvs } from '@ledgerhq/live-common/lib/env'
import { createCustomErrorClass } from '@ledgerhq/errors'
import libcoreChangePasswordCmd from 'commands/libcoreChangePassword'
import libcoreGetPoolNameCmd from 'commands/libcoreGetPoolName'

const LibcoreWrongPassword = createCustomErrorClass('LibcoreWrongPassword')
const LibcorePasswordMigrationFail = createCustomErrorClass('LibcorePasswordMigrationFail')

const reloadLibcore = () => {
  ipcRenderer.send('set-envs', getAllEnvs())
}

export const isUnlocked = async () => {
  try {
    await libcoreGetPoolNameCmd.send().toPromise()
    return true
  } catch (e) {
    return false
  }
}

export const setPassword = (password: string) => {
  if (password !== getEnv('LIBCORE_PASSWORD')) {
    setEnvUnsafe('LIBCORE_PASSWORD', password)
    reloadLibcore()
  }
}

export const changePassword = async (newPassword: string) => {
  const oldPassword = getEnv('LIBCORE_PASSWORD')

  await libcoreChangePasswordCmd.send({ oldPassword, newPassword }).toPromise()

  setPassword(newPassword)
}

export const unlock = async (password: string) => {
  setPassword(password)

  const unlocked = await isUnlocked()

  if (!unlocked) {
    throw new LibcoreWrongPassword()
  }
}

export const encryptionMigration = async (password: string) => {
  setPassword('')

  try {
    await changePassword(password)
  } catch (err) {
    throw new LibcorePasswordMigrationFail()
  }
}

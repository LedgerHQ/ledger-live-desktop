// @flow
import { ipcRenderer } from 'electron'
import { setEnvUnsafe, getEnv, getAllEnvs } from '@ledgerhq/live-common/lib/env'
import libcoreChangePasswordCmd from 'commands/libcoreChangePassword'

const reloadLibcore = () => {
  ipcRenderer.send('set-envs', getAllEnvs())
}

export const setPassword = (password: string) => {
  setEnvUnsafe('LIBCORE_PASSWORD', password)
  reloadLibcore()
}

export const changePassword = async (newPassword: string) => {
  const oldPassword = getEnv('LIBCORE_PASSWORD')

  await libcoreChangePasswordCmd.send({ oldPassword, newPassword }).toPromise()

  setPassword(newPassword)
}

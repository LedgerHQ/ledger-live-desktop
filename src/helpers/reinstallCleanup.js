// @flow

import fs from 'fs'
import { app } from 'electron'
import path from 'path'
import { hardReset } from 'helpers/reset'

export const checkFlag = async () => {
  if (__PROD__) {
    try {
      await fs.stat(app.getPath('exe'), async (err, stats) => {
        const executableCreationDate = stats.ctime
        const userData = app.getPath('userData')
        const dataFolder = fs.readdirSync(userData)
        let flag
        let kill = false

        dataFolder.filter(file => {
          if (file.match(/\d+\.flag/g)) {
            flag = true
            const date = new Date(+file.slice(0, -5))
            if (date - executableCreationDate) {
              // TODO Currently triggers reset / maybe ask user?
              kill = true
              fs.unlink(path.resolve(userData, file))
              fs.writeFileSync(
                path.resolve(userData, `${executableCreationDate.getTime()}.flag`),
                '',
                'utf-8',
              )
            }
          }
          return false
        })

        if (kill) await hardReset()
        if (flag) return

        fs.writeFileSync(
          path.resolve(userData, `${executableCreationDate.getTime()}.flag`),
          '',
          'utf-8',
        )
      })
    } catch (e) {
      //
    }
  }
}

export const deleteInstallFlag = () => {
  const userData = app.getPath('userData')
  fs.readdirSync(userData)
    .filter(f => /\d+\.flag/g.test(f))
    .map(f => fs.unlinkSync(path.resolve(userData, f)))
}

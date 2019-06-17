// @flow
import logger from 'logger'
import moment from 'moment'
import fs from 'fs'
import { ipcRenderer, webFrame, remote } from 'electron'
import React, { Component } from 'react'
import { translate } from 'react-i18next'
import { getAllEnvs } from '@ledgerhq/live-common/lib/env'
import getUser from 'helpers/user'
import KeyHandler from 'react-key-handler'
import Button from './base/Button'

const queryLogs = () =>
  new Promise(success => {
    ipcRenderer.once('logs', (event: any, { logs }) => {
      success(logs)
    })
    ipcRenderer.send('queryLogs')
  })

function writeToFile(file, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, error => {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  })
}

class ExportLogsBtn extends Component<{
  t: *,
  hookToShortcut?: boolean,
}> {
  export = async () => {
    const resourceUsage = webFrame.getResourceUsage()
    const user = await getUser()
    logger.log('exportLogsMeta', {
      resourceUsage,
      release: __APP_VERSION__,
      git_commit: __GIT_REVISION__,
      environment: __DEV__ ? 'development' : 'production',
      userAgent: window.navigator.userAgent,
      userAnonymousId: user.id,
      env: {
        ...getAllEnvs(),
      },
    })
    const path = remote.dialog.showSaveDialog({
      title: 'Export logs',
      defaultPath: `ledgerlive-logs-${moment().format('YYYY.MM.DD-HH.mm.ss')}-${__GIT_REVISION__ ||
        'unversionned'}.json`,
      filters: [
        {
          name: 'All Files',
          extensions: ['json'],
        },
      ],
    })
    if (path) {
      const logs = await queryLogs()
      const json = JSON.stringify(logs)
      await writeToFile(path, json)
    }
  }

  exporting = false
  handleExportLogs = () => {
    if (this.exporting) return
    this.exporting = true
    this.export()
      .catch(e => {
        logger.critical(e)
      })
      .then(() => {
        this.exporting = false
      })
  }

  onKeyHandle = e => {
    if (e.ctrlKey) {
      this.handleExportLogs()
    }
  }

  render() {
    const { t, hookToShortcut } = this.props
    return hookToShortcut ? (
      <KeyHandler keyValue="e" onKeyHandle={this.onKeyHandle} />
    ) : (
      <Button small primary event="ExportLogs" onClick={this.handleExportLogs}>
        {t('settings.exportLogs.btn')}
      </Button>
    )
  }
}

export default translate()(ExportLogsBtn)

// @flow
import logger from 'logger'
import moment from 'moment'
import fs from 'fs'
import { webFrame, remote } from 'electron'
import React, { Component } from 'react'
import { translate } from 'react-i18next'
import KeyHandler from 'react-key-handler'
import { getCurrentLogFile } from 'helpers/resolveLogsDirectory'
import Button from './base/Button'

function copyFile(source, target) {
  const rd = fs.createReadStream(source)
  const wr = fs.createWriteStream(target)
  return new Promise((resolve, reject) => {
    rd.on('error', reject)
    wr.on('error', reject)
    wr.on('finish', resolve)
    rd.pipe(wr)
  }).catch(error => {
    // $FlowFixMe
    rd.destroy()
    wr.end()
    throw error
  })
}

class ExportLogsBtn extends Component<{
  t: *,
  hookToShortcut?: boolean,
}> {
  export = async () => {
    const srcLogFile = await getCurrentLogFile()
    const resourceUsage = webFrame.getResourceUsage()
    const ext = srcLogFile.match(/[.]log[.]gz$/) ? 'log.gz' : 'log'
    logger.log('exportLogsMeta', {
      resourceUsage,
      release: __APP_VERSION__,
      git_commit: __GIT_REVISION__,
      environment: __DEV__ ? 'development' : 'production',
      userAgent: window.navigator.userAgent,
    })
    const path = remote.dialog.showSaveDialog({
      title: 'Export logs',
      defaultPath: `ledgerlive-export-${moment().format(
        'YYYY.MM.DD-HH.mm.ss',
      )}-${__GIT_REVISION__ || 'unversionned'}.${ext}`,
      filters: [
        {
          name: 'All Files',
          extensions: [ext],
        },
      ],
    })
    if (path) {
      await copyFile(srcLogFile, path)
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
        {t('app:settings.exportLogs.btn')}
      </Button>
    )
  }
}

export default translate()(ExportLogsBtn)

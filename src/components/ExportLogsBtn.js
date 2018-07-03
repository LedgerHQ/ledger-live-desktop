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

class ExportLogsBtn extends Component<{
  t: *,
  hookToShortcut?: boolean,
}> {
  handleExportLogs = () => {
    const srcLogFile = getCurrentLogFile()
    const resourceUsage = webFrame.getResourceUsage()
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
      )}-${__GIT_REVISION__ || 'unversionned'}.log`,
      filters: [
        {
          name: 'All Files',
          extensions: ['log'],
        },
      ],
    })
    if (path) {
      fs.createReadStream(srcLogFile).pipe(fs.createWriteStream(path))
    }
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

// @flow
import logger from 'logger'
import moment from 'moment'
import fs from 'fs'
import { webFrame, remote } from 'electron'
import React, { Component } from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import KeyHandler from 'react-key-handler'
import { createStructuredSelector, createSelector } from 'reselect'
import { accountsSelector, encodeAccountsModel } from 'reducers/accounts'
import { storeSelector as settingsSelector } from 'reducers/settings'
import Button from './base/Button'

const mapStateToProps = createStructuredSelector({
  accounts: createSelector(accountsSelector, encodeAccountsModel),
  settings: settingsSelector,
})

class ExportLogsBtn extends Component<{
  t: *,
  settings: *,
  accounts: *,
  hookToShortcut?: boolean,
}> {
  handleExportLogs = () => {
    const { accounts, settings } = this.props
    const logs = logger.exportLogs()
    const resourceUsage = webFrame.getResourceUsage()
    const report = { resourceUsage, logs, accounts, settings, date: new Date() }
    console.log(report) // eslint-disable-line no-console
    const reportJSON = JSON.stringify(report)
    const path = remote.dialog.showSaveDialog({
      title: 'Export logs',
      defaultPath: `ledgerlive-export-${moment().format(
        'YYYY.MM.DD-HH.mm.ss',
      )}-${__GIT_REVISION__ || 'unversionned'}.json`,
      filters: [
        {
          name: 'All Files',
          extensions: ['json'],
        },
      ],
    })
    if (path) {
      fs.writeFile(path, reportJSON, err => {
        if (err) {
          logger.error(err)
        }
      })
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
      <Button primary onClick={this.handleExportLogs}>
        {t('app:settings.exportLogs.btn')}
      </Button>
    )
  }
}

export default translate()(connect(mapStateToProps)(ExportLogsBtn))

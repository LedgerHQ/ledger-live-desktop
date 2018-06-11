// @flow
import logger from 'logger'
import moment from 'moment'
import fs from 'fs'
import { webFrame, remote } from 'electron'
import React, { Component } from 'react'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
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
      defaultPath: `ledger_export_${moment().format('YYYY-MM-DD_HHmmss')}.json`,
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

  render() {
    const { t } = this.props
    return (
      <Button primary onClick={this.handleExportLogs}>
        {t('settings:exportLogs.btn')}
      </Button>
    )
  }
}

export default translate()(connect(mapStateToProps)(ExportLogsBtn))

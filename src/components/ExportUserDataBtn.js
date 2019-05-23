// @flow

import React, { Component } from 'react'
import { remote } from 'electron'
import { translate } from 'react-i18next'

import Button from 'components/base/Button'
import moment from 'moment'
import fs from 'fs'

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

class ExportUserDataBtn extends Component<{
  t: *,
}> {
  handleExportUserData = async () => {
    const path = remote.dialog.showSaveDialog({
      title: 'User Data',
      defaultPath: `ledgerlive-data-${moment().format('YYYY.MM.DD-HH.mm.ss')}.json`,
      filters: [
        {
          name: 'All Files',
          extensions: ['json'],
        },
      ],
    })
    if (path) {
      const json = JSON.stringify(JSON.parse(window.localStorage.getItem('app')) || {}, null, 4)
      await writeToFile(path, json)
    }
  }

  render() {
    const { t } = this.props
    return (
      <Button primary small onClick={this.handleExportUserData}>
        {t('settings.exportUserData.btn')}
      </Button>
    )
  }
}

export default translate()(ExportUserDataBtn)

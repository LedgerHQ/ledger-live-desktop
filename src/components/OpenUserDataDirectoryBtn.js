// @flow

import React, { Component } from 'react'
import logger from 'logger'
import { shell } from 'electron'
import { translate } from 'react-i18next'

import resolveUserDataDirectory from 'helpers/resolveUserDataDirectory'
import Button from 'components/base/Button'

class OpenUserDataDirectoryBtn extends Component<{
  t: *,
}> {
  handleOpenUserDataDirectory = async () => {
    const userDataDirectory = resolveUserDataDirectory()
    logger.log(`Opening user data directory: ${userDataDirectory}`)
    shell.openItem(userDataDirectory)
  }

  render() {
    const { t } = this.props
    return (
      <Button primary small onClick={this.handleOpenUserDataDirectory}>
        {t('settings.openUserDataDirectory.btn')}
      </Button>
    )
  }
}

export default translate()(OpenUserDataDirectoryBtn)

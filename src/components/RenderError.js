// @flow

import React, { PureComponent } from 'react'
import { shell, remote } from 'electron'
import qs from 'querystring'
import { translate } from 'react-i18next'

import { i } from 'helpers/staticPath'
import hardReset from 'helpers/hardReset'

import type { T } from 'types/common'

import ExportLogsBtn from 'components/ExportLogsBtn'
import Box from 'components/base/Box'
import Space from 'components/base/Space'
import Button from 'components/base/Button'
// import TranslatedError from './TranslatedError'

type Props = {
  error: Error,
  t: T,
  disableExport?: boolean,
  children?: *,
}

class RenderError extends PureComponent<Props, { isHardResetting: boolean }> {
  state = {
    isHardResetting: false,
  }

  handleCreateIssue = () => {
    const { error } = this.props
    if (!error) {
      return
    }
    const q = qs.stringify({
      title: `Error: ${error.message}`,
      body: `Error was thrown:

\`\`\`
${error.stack}
\`\`\`
`,
    })
    shell.openExternal(`https://github.com/LedgerHQ/ledger-live-desktop/issues/new?${q}`)
  }

  handleRestart = () => {
    remote.getCurrentWindow().webContents.reloadIgnoringCache()
  }

  handleHardReset = async () => {
    this.setState({ isHardResetting: true })
    try {
      await hardReset()
      remote.getCurrentWindow().webContents.reloadIgnoringCache()
    } catch (err) {
      this.setState({ isHardResetting: false })
    }
  }

  render() {
    const { t, disableExport, children } = this.props
    const { isHardResetting } = this.state
    return (
      <Box align="center" justify="center" grow>
        <img alt="" src={i('crash-screen.svg')} width={380} />
        <Space of={40} />
        <Box ff="Museo Sans|Regular" fontSize={7} color="dark">
          {t('app:crash.oops')}
        </Box>
        <Space of={15} />
        <Box
          style={{ width: 500 }}
          textAlign="center"
          ff="Open Sans|Regular"
          color="smoke"
          fontSize={4}
        >
          {t('app:crash.uselessText')}
        </Box>
        <Space of={30} />
        <Box horizontal flow={2}>
          <Button primary onClick={this.handleRestart}>
            {t('app:crash.restart')}
          </Button>
          <Button danger onClick={this.handleHardReset} isLoading={isHardResetting}>
            {t('app:crash.reset')}
          </Button>
          {!disableExport ? <ExportLogsBtn /> : null}
          <Button primary onClick={this.handleCreateIssue}>
            {t('app:crash.createTicket')}
          </Button>
        </Box>
        {children}
      </Box>
    )
  }
}
// <TranslatedError error={error} />

export default translate()(RenderError)

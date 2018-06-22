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
import IconTriangleWarning from 'icons/TriangleWarning'
import ConfirmModal from './base/Modal/ConfirmModal'
import { IconWrapperCircle } from './SettingsPage/sections/Profile'

type Props = {
  error: Error,
  t: T,
  disableExport?: boolean,
  children?: *,
}

class RenderError extends PureComponent<
  Props,
  { isHardResetting: boolean, isHardResetModalOpened: boolean },
> {
  state = {
    isHardResetting: false,
    isHardResetModalOpened: false,
  }

  handleOpenHardResetModal = () => this.setState({ isHardResetModalOpened: true })
  handleCloseHardResetModal = () => this.setState({ isHardResetModalOpened: false })

  handleHardReset = async () => {
    this.setState({ isHardResetting: true })
    try {
      await hardReset()
      remote.getCurrentWindow().webContents.reloadIgnoringCache()
    } catch (err) {
      this.setState({ isHardResetting: false })
    }
  }
  hardResetIconRender = () => (
    <IconWrapperCircle color="alertRed">
      <IconTriangleWarning width={23} height={21} />
    </IconWrapperCircle>
  )

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
    const { error, t, disableExport, children } = this.props
    const { isHardResetting, isHardResetModalOpened } = this.state
    return (
      <Box align="center" grow>
        <Space of={100} />
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
          {!disableExport ? <ExportLogsBtn /> : null}
          <Button primary onClick={this.handleCreateIssue}>
            {t('app:crash.createTicket')}
          </Button>
          <Button danger onClick={this.handleOpenHardResetModal}>
            {t('app:crash.reset')}
          </Button>
        </Box>
        <ConfirmModal
          isDanger
          isLoading={isHardResetting}
          isOpened={isHardResetModalOpened}
          onClose={this.handleCloseHardResetModal}
          onReject={this.handleCloseHardResetModal}
          onConfirm={this.handleHardReset}
          title={t('app:settings.hardResetModal.title')}
          desc={t('app:settings.hardResetModal.desc')}
          renderIcon={this.hardResetIconRender}
        />
        <Box my={6}>
          <ErrContainer>
            <strong>{String(error)}</strong>
            <div>{error.stack || 'no stacktrace'}</div>
          </ErrContainer>
        </Box>
        <pre
          style={{
            position: 'fixed',
            bottom: 8,
            left: 8,
            opacity: 0.2,
            fontSize: 10,
          }}
        >
          {__APP_VERSION__}
        </pre>
        {children}
      </Box>
    )
  }
}

const ErrContainer = ({ children }: { children: any }) => (
  <pre
    style={{
      margin: 'auto',
      maxWidth: '80vw',
      overflow: 'auto',
      fontSize: 10,
      fontFamily: 'monospace',
      cursor: 'text',
      userSelect: 'text',
      opacity: 0.3,
    }}
  >
    {children}
  </pre>
)

export default translate()(RenderError)

// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { openURL } from 'helpers/linking'
import { remote } from 'electron'
import { translate } from 'react-i18next'

import { urls } from 'config/urls'
import { i } from 'helpers/staticPath'
import hardReset from 'helpers/hardReset'

import type { T } from 'types/common'

import ExportLogsBtn from 'components/ExportLogsBtn'
import Box from 'components/base/Box'
import Space from 'components/base/Space'
import Button from 'components/base/Button'
import ConfirmModal from 'components/base/Modal/ConfirmModal'
import IconTriangleWarning from 'icons/TriangleWarning'

// SERIOUSLY plz refactor to use <ResetButton>
import { IconWrapperCircle } from './SettingsPage/ResetButton'

type Props = {
  error: Error,
  t: T,
  withoutAppData?: boolean,
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

  hardResetIconRender = () => (
    <IconWrapperCircle color="alertRed">
      <IconTriangleWarning width={23} height={21} />
    </IconWrapperCircle>
  )

  github = () => {
    openURL(urls.githubIssues)
  }

  contact = () => {
    openURL(urls.contactSupport)
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
    const { error, t, withoutAppData, children } = this.props
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
          <Button small primary onClick={this.handleRestart}>
            {t('app:crash.restart')}
          </Button>
          <ExportLogsBtn withoutAppData={withoutAppData} />
          <Button small primary onClick={this.contact}>
            {t('app:crash.support')}
          </Button>
          <Button small primary onClick={this.github}>
            {t('app:crash.github')}
          </Button>
          <Button small danger onClick={this.handleOpenHardResetModal}>
            {t('app:common.reset')}
          </Button>
        </Box>
        <ConfirmModal
          analyticsName="HardReset"
          isDanger
          isLoading={isHardResetting}
          isOpened={isHardResetModalOpened}
          onClose={this.handleCloseHardResetModal}
          onReject={this.handleCloseHardResetModal}
          onConfirm={this.handleHardReset}
          confirmText={t('app:common.reset')}
          title={t('app:settings.hardResetModal.title')}
          desc={t('app:settings.hardResetModal.desc')}
          renderIcon={this.hardResetIconRender}
        />
        <Box my={6}>
          <ErrContainer>{`${String(error)}
${error.stack || 'no stacktrace'}`}</ErrContainer>
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
          {`Ledger Live ${__APP_VERSION__}`}
        </pre>
        {children}
      </Box>
    )
  }
}

const ErrContainer = styled.pre`
  margin: auto;
  max-width: 80vw;
  overflow: auto;
  font-size: 10px;
  font-family: monospace;
  cursor: text;
  user-select: text;
  opacity: 0.3;
`

export default translate()(RenderError)

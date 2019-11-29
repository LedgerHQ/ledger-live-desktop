// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { openURL } from 'helpers/linking'
import { remote } from 'electron'
import { translate } from 'react-i18next'

import { urls } from 'config/urls'
import { i } from 'helpers/staticPath'
import { hardReset } from 'helpers/reset'

import type { T } from 'types/common'

import TriggerAppReady from 'components/TriggerAppReady'
import ExportLogsBtn from 'components/ExportLogsBtn'
import Box from 'components/base/Box'
import Space from 'components/base/Space'
import Button from 'components/base/Button'
import ConfirmModal from 'components/base/Modal/ConfirmModal'
import ExternalLinkButton from 'components/base/ExternalLinkButton'
import IconTriangleWarning from 'icons/TriangleWarning'

// SERIOUSLY plz refactor to use <ResetButton>
import { IconWrapperCircle } from './SettingsPage/ResetButton'

const printError = (error: mixed) => {
  const print = []

  if (!error) {
    return 'bad error'
  }

  if (error.message) {
    print.push(error.message)
  }

  if (error.stack) {
    print.push(error.stack)
  } else {
    print.push(error.name)
    print.push('no call stack available :(')
  }

  return print.join('\n')
}

type Props = {
  error: Error,
  t: T,
  withoutAppData?: boolean,
  children?: *,
}

class Unsafe extends PureComponent<*, *> {
  state = {
    error: null,
  }
  componentDidCatch(error) {
    this.setState({ error })
  }
  render() {
    const { children, prefix } = this.props
    const { error } = this.state
    if (error) {
      return (
        <Box my={6}>
          <ErrContainer>{`${prefix}: ${printError(error)}`}</ErrContainer>
        </Box>
      )
    }
    return children
  }
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
      <Box align="center" grow bg="palette.background.default">
        <TriggerAppReady />
        <Space of={100} />
        <img alt="" src={i('crash-screen.svg')} width={380} />
        <Space of={40} />
        <Box ff="Inter|Regular" fontSize={7} color="palette.text.shade100">
          {t('crash.oops')}
        </Box>
        <Space of={15} />
        <Box
          style={{ width: 500 }}
          textAlign="center"
          ff="Inter|Regular"
          color="palette.text.shade80"
          fontSize={4}
        >
          {t('crash.uselessText')}
        </Box>
        <Space of={30} />
        <Box horizontal flow={2}>
          <Button small primary onClick={this.handleRestart}>
            {t('crash.restart')}
          </Button>
          <ExportLogsBtn withoutAppData={withoutAppData} />
          <ExternalLinkButton small primary label={t('crash.support')} url={urls.contactSupport} />
          <Button small primary onClick={this.github}>
            {t('crash.github')}
          </Button>
          <Button small danger onClick={this.handleOpenHardResetModal}>
            {t('common.reset')}
          </Button>
        </Box>
        <Box my={6} color="palette.text.shade80">
          <ErrContainer>{printError(error)}</ErrContainer>
        </Box>
        <Unsafe prefix="redux failed">
          <ConfirmModal
            analyticsName="HardReset"
            isDanger
            isLoading={isHardResetting}
            isOpened={isHardResetModalOpened}
            onClose={this.handleCloseHardResetModal}
            onReject={this.handleCloseHardResetModal}
            onConfirm={this.handleHardReset}
            confirmText={t('common.reset')}
            title={t('settings.hardResetModal.title')}
            desc={t('settings.hardResetModal.desc')}
            renderIcon={this.hardResetIconRender}
          />
        </Unsafe>
        <VersionContainer>{`Ledger Live ${__APP_VERSION__}`}</VersionContainer>
        {children}
      </Box>
    )
  }
}

const VersionContainer = styled.pre`
  position: fixed;
  bottom: 8px;
  left: 8px;
  fontsize: 8;
  color: ${p => p.theme.colors.palette.text.shade60};
`

const ErrContainer = styled.pre`
  margin: auto;
  max-width: 80vw;
  overflow: auto;
  font-size: 10px;
  font-family: monospace;
  cursor: text;
  user-select: text;
`

export default translate()(RenderError)

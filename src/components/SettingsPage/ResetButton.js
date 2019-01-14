// @flow

import React, { Fragment, PureComponent } from 'react'
import styled from 'styled-components'
import { remote } from 'electron'
import { translate } from 'react-i18next'
import logger from 'logger'
import type { T } from 'types/common'
import { hardReset } from 'helpers/reset'
import Box from 'components/base/Box'
import Button from 'components/base/Button'
import ConfirmModal from 'components/base/Modal/ConfirmModal'
import IconTriangleWarning from 'icons/TriangleWarning'
import ResetFallbackModal from './ResetFallbackModal'

type Props = {
  t: T,
}

type State = {
  opened: boolean,
  pending: boolean,
  fallbackOpened: boolean,
}

class ResetButton extends PureComponent<Props, State> {
  state = {
    opened: false,
    pending: false,
    fallbackOpened: false,
  }

  open = () => this.setState({ opened: true })
  close = () => this.setState({ opened: false })
  closeFallback = () => this.setState({ fallbackOpened: false })

  action = async () => {
    this.setState({ pending: true })
    try {
      await hardReset()
      remote.getCurrentWindow().webContents.reloadIgnoringCache()
    } catch (err) {
      logger.error(err)
      this.setState({ pending: false, fallbackOpened: true })
    }
  }

  render() {
    const { t } = this.props
    const { opened, pending, fallbackOpened } = this.state

    return (
      <Fragment>
        <Button small danger onClick={this.open} event="HardResetIntent">
          {t('common.reset')}
        </Button>

        <ConfirmModal
          analyticsName="HardReset"
          isDanger
          centered
          isLoading={pending}
          isOpened={opened}
          onClose={this.close}
          onReject={this.close}
          onConfirm={this.action}
          confirmText={t('common.reset')}
          title={t('settings.hardResetModal.title')}
          desc={t('settings.hardResetModal.desc')}
          renderIcon={() => (
            // FIXME why not pass in directly the DOM 🤷🏻
            <IconWrapperCircle color="alertRed">
              <IconTriangleWarning width={23} height={21} />
            </IconWrapperCircle>
          )}
        />

        <ResetFallbackModal isOpened={fallbackOpened} onClose={this.closeFallback} />
      </Fragment>
    )
  }
}

export const IconWrapperCircle = styled(Box)`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #ea2e4919;
  align-items: center;
  justify-content: center;
`

export default translate()(ResetButton)

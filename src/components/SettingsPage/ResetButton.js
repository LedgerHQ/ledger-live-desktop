// @flow

import React, { Fragment, PureComponent } from 'react'
import styled from 'styled-components'
import { remote } from 'electron'
import { translate } from 'react-i18next'
import type { T } from 'types/common'
import hardReset from 'helpers/hardReset'
import Box from 'components/base/Box'
import Button from 'components/base/Button'
import { ConfirmModal } from 'components/base/Modal'
import IconTriangleWarning from 'icons/TriangleWarning'

type Props = {
  t: T,
}

type State = {
  opened: boolean,
  pending: boolean,
}

class ResetButton extends PureComponent<Props, State> {
  state = {
    opened: false,
    pending: false,
  }

  open = () => this.setState({ opened: true })
  close = () => this.setState({ opened: false })

  action = async () => {
    this.setState({ pending: true })
    try {
      await hardReset()
      remote.getCurrentWindow().webContents.reloadIgnoringCache()
    } catch (err) {
      this.setState({ pending: false })
    }
  }

  render() {
    const { t } = this.props
    const { opened, pending } = this.state
    return (
      <Fragment>
        <Button small danger onClick={this.open} event="HardResetIntent">
          {t('app:settings.profile.hardReset')}
        </Button>

        <ConfirmModal
          isDanger
          isLoading={pending}
          isOpened={opened}
          onClose={this.close}
          onReject={this.close}
          onConfirm={this.action}
          confirmText={t('app:common.reset')}
          title={t('app:settings.hardResetModal.title')}
          desc={t('app:settings.hardResetModal.desc')}
          renderIcon={() => (
            // FIXME why not pass in directly the DOM 🤷🏻
            <IconWrapperCircle color="alertRed">
              <IconTriangleWarning width={23} height={21} />
            </IconWrapperCircle>
          )}
        />
      </Fragment>
    )
  }
}

export const IconWrapperCircle = styled(Box)`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #ea2e4919;
  text-align: center;
  justify-content: center;
`

export default translate()(ResetButton)

// @flow

import React, { Fragment, PureComponent } from 'react'
import { translate } from 'react-i18next'
import type { T } from 'types/common'
import firmwareRepair from 'commands/firmwareRepair'
import Button from 'components/base/Button'
import { RepairModal } from 'components/base/Modal'

type Props = {
  t: T,
}

type State = {
  opened: boolean,
  isLoading: boolean,
  error: ?Error,
  progress: number,
}

class RepairDeviceButton extends PureComponent<Props, State> {
  state = {
    opened: false,
    isLoading: false,
    error: null,
    progress: 0,
  }

  open = () => this.setState({ opened: true })

  sub: *

  close = () => {
    if (this.sub) this.sub.unsubscribe()
    this.setState({ opened: false, isLoading: false })
  }

  action = () => {
    if (this.state.isLoading) return
    this.setState({ isLoading: true })
    this.sub = firmwareRepair.send().subscribe({
      next: patch => {
        this.setState(patch)
      },
      error: error => {
        this.setState({ error, isLoading: false })
      },
      complete: () => {
        this.setState({ opened: false, isLoading: false })
      },
    })
  }

  render() {
    const { t } = this.props
    const { opened, isLoading, error, progress } = this.state

    return (
      <Fragment>
        <Button small primary onClick={this.open} event="RepairDeviceButton">
          {t('settings.repairDevice.button')}
        </Button>

        <RepairModal
          cancellable
          analyticsName="RepairDevice"
          isOpened={opened}
          onClose={this.close}
          onReject={this.close}
          onConfirm={this.action}
          isLoading={isLoading}
          title={t('settings.repairDevice.title')}
          desc={t('settings.repairDevice.desc')}
          confirmText={t('settings.repairDevice.button')}
          progress={progress}
          error={error}
        />
      </Fragment>
    )
  }
}

export default translate()(RepairDeviceButton)

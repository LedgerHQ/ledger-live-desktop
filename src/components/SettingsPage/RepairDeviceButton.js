// @flow

import React, { Fragment, PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { translate } from 'react-i18next'
import { push } from 'react-router-redux'
import logger from 'logger'

import type { T } from 'types/common'
import firmwareRepair from 'commands/firmwareRepair'
import Button from 'components/base/Button'
import { RepairModal } from 'components/base/Modal'

type Props = {
  t: T,
  push: string => void,
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

  open = () => this.setState({ opened: true, error: null })

  sub: *

  close = () => {
    if (this.sub) this.sub.unsubscribe()
    this.setState({ opened: false, isLoading: false, error: null, progress: 0 })
  }

  repair = (version = null) => {
    if (this.state.isLoading) return
    const { push } = this.props
    this.setState({ isLoading: true })
    this.sub = firmwareRepair.send({ version }).subscribe({
      next: patch => {
        this.setState(patch)
      },
      error: error => {
        logger.critical(error)
        this.setState({ error, isLoading: false, progress: 0 })
      },
      complete: () => {
        this.setState({ opened: false, isLoading: false, progress: 0 }, () => {
          push('/manager')
        })
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
          repair={this.repair}
          isLoading={isLoading}
          title={t('settings.repairDevice.title')}
          desc={t('settings.repairDevice.desc')}
          progress={progress}
          error={error}
        />
      </Fragment>
    )
  }
}

const mapDispatchToProps = {
  push,
}

export default compose(
  translate(),
  withRouter,
  connect(
    null,
    mapDispatchToProps,
  ),
)(RepairDeviceButton)

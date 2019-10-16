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
import RepairModal from 'components/base/Modal/RepairModal'

type Props = {
  t: T,
  push: string => void,
  buttonProps?: *,
  onRepair?: boolean => void,
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

  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }

    if (this.sub) this.sub.unsubscribe()
  }

  open = () => this.setState({ opened: true, error: null })

  sub: *
  timeout: *

  close = () => {
    const { onRepair } = this.props
    if (this.sub) this.sub.unsubscribe()
    if (this.timeout) clearTimeout(this.timeout)
    if (onRepair) {
      onRepair(false)
    }
    this.setState({ opened: false, isLoading: false, error: null, progress: 0 })
  }

  repair = (version = null) => {
    if (this.state.isLoading) return
    const { push, onRepair } = this.props
    if (onRepair) {
      onRepair(true)
    }
    this.timeout = setTimeout(() => this.setState({ isLoading: true }), 500)
    this.sub = firmwareRepair.send({ version }).subscribe({
      next: patch => {
        this.setState(patch)
      },
      error: error => {
        logger.critical(error)
        if (this.timeout) clearTimeout(this.timeout)
        this.setState({ error, isLoading: false, progress: 0 })
      },
      complete: () => {
        if (this.timeout) clearTimeout(this.timeout)
        this.setState({ opened: false, isLoading: false, progress: 0 }, () => {
          push('/manager')
        })
        if (onRepair) {
          onRepair(false)
        }
      },
    })
  }

  render() {
    const { t, buttonProps } = this.props
    const { opened, isLoading, error, progress } = this.state

    return (
      <Fragment>
        <Button {...buttonProps} primary onClick={this.open} event="RepairDeviceButton">
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

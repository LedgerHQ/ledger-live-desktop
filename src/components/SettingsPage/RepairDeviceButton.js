// @flow

import React, { Fragment, PureComponent } from 'react'
import { filter, tap } from 'rxjs/operators'
import { translate } from 'react-i18next'
import type { T } from 'types/common'
import firmwareRepair from 'commands/firmwareRepair'
import Button from 'components/base/Button'
import { ConfirmModal } from 'components/base/Modal'

type Props = {
  t: T,
}

type State = {
  opened: boolean,
  isLoading: boolean,
  error: ?Error,
}

class CleanButton extends PureComponent<Props, State> {
  state = {
    opened: false,
    isLoading: false,
    error: null,
  }

  open = () => this.setState({ opened: true })

  sub: *

  close = () => {
    if (this.sub) this.sub.unsubscribe()
    this.setState({ opened: false })
  }

  action = () => {
    if (this.state.isLoading) return
    this.setState({ isLoading: true })
    this.sub = firmwareRepair
      .send()
      .pipe(
        tap(e => console.log(e)), // eslint-disable-line no-console
        // ^ TODO remove at the end
        filter(e => e.type === 'bulk-progress'),
      )
      .subscribe({
        next: () => {
          // TODO cc @val
        },
        error: error => {
          this.setState({ error, opened: false, isLoading: false })
        },
        complete: () => {
          this.setState({ opened: false, isLoading: false })
        },
      })
  }

  render() {
    const { t } = this.props
    const { opened, isLoading, error } = this.state
    // @val basically I think we want to diverge from the traditional ConfirmModal to make our own version
    // with the progress and the error cases handled.
    console.log({ error }) // eslint-disable-line no-console
    // ^ TODO use error to pass in that custom thing
    return (
      <Fragment>
        <Button small primary onClick={this.open} event="RepairDeviceButton">
          {t('settings.repairDevice.button')}
        </Button>

        <ConfirmModal
          cancellable
          analyticsName="RepairDevice"
          isOpened={opened}
          onClose={this.close}
          onReject={this.close}
          onConfirm={this.action}
          isLoading={isLoading}
          title={t('settings.repairDevice.title')}
          subTitle={t('common.areYouSure')}
          desc={t('settings.repairDevice.desc')}
        />
      </Fragment>
    )
  }
}

export default translate()(CleanButton)

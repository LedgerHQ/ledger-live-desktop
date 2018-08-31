// @flow

import React, { Fragment, PureComponent } from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import type { T } from 'types/common'
import { cleanAccountsCache } from 'actions/accounts'
import Button from 'components/base/Button'
import { ConfirmModal } from 'components/base/Modal'
import { softReset } from 'helpers/reset'

const mapDispatchToProps = {
  cleanAccountsCache,
}

type Props = {
  t: T,
  cleanAccountsCache: () => *,
}

type State = {
  opened: boolean,
  isLoading: boolean,
}

class CleanButton extends PureComponent<Props, State> {
  state = {
    opened: false,
    isLoading: false,
  }

  open = () => this.setState({ opened: true })

  close = () => this.setState({ opened: false })

  action = async () => {
    if (this.state.isLoading) return
    try {
      this.setState({ isLoading: true })
      await softReset({ cleanAccountsCache: this.props.cleanAccountsCache })
    } finally {
      this.setState({ isLoading: false })
    }
  }

  render() {
    const { t } = this.props
    const { opened, isLoading } = this.state
    return (
      <Fragment>
        <Button small primary onClick={this.open} event="ClearCacheIntent">
          {t('app:settings.profile.softReset')}
        </Button>

        <ConfirmModal
          analyticsName="CleanCache"
          isOpened={opened}
          onClose={this.close}
          onReject={this.close}
          onConfirm={this.action}
          isLoading={isLoading}
          title={t('app:settings.softResetModal.title')}
          subTitle={t('app:common.areYouSure')}
          desc={t('app:settings.softResetModal.desc')}
        />
      </Fragment>
    )
  }
}

export default translate()(
  connect(
    null,
    mapDispatchToProps,
  )(CleanButton),
)

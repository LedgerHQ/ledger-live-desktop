// @flow

import React, { Fragment, PureComponent } from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import logger from 'logger'
import type { T } from 'types/common'
import { cleanAccountsCache } from 'actions/accounts'
import Button from 'components/base/Button'
import ConfirmModal from 'components/base/Modal/ConfirmModal'
import { softReset } from 'helpers/reset'
import ResetFallbackModal from './ResetFallbackModal'

const mapDispatchToProps = {
  cleanAccountsCache,
}

type Props = {
  t: T,
  cleanAccountsCache: () => *,
}

type State = {
  opened: boolean,
  fallbackOpened: boolean,
  isLoading: boolean,
}

class CleanButton extends PureComponent<Props, State> {
  state = {
    opened: false,
    fallbackOpened: false,
    isLoading: false,
  }

  open = () => this.setState({ opened: true })

  close = () => this.setState({ opened: false })
  closeFallback = () => this.setState({ fallbackOpened: false })

  action = async () => {
    if (this.state.isLoading) return
    try {
      this.setState({ isLoading: true })
      await softReset({ cleanAccountsCache: this.props.cleanAccountsCache })
    } catch (err) {
      logger.error(err)
      this.setState({ isLoading: false, fallbackOpened: true })
    }
  }

  render() {
    const { t } = this.props
    const { opened, isLoading, fallbackOpened } = this.state
    return (
      <Fragment>
        <Button small primary onClick={this.open} event="ClearCacheIntent">
          {t('settings.profile.softReset')}
        </Button>

        <ConfirmModal
          analyticsName="CleanCache"
          centered
          isOpened={opened}
          onClose={this.close}
          onReject={this.close}
          onConfirm={this.action}
          isLoading={isLoading}
          title={t('settings.softResetModal.title')}
          subTitle={t('common.areYouSure')}
          desc={t('settings.softResetModal.desc')}
        />

        <ResetFallbackModal isOpened={fallbackOpened} onClose={this.closeFallback} />
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

// @flow

import React, { Fragment, PureComponent } from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import type { T } from 'types/common'
import { remote } from 'electron'
import { cleanAccountsCache } from 'actions/accounts'
import db from 'helpers/db'
import { delay } from 'helpers/promise'
import Button from 'components/base/Button'
import { ConfirmModal } from 'components/base/LegacyModal'

const mapDispatchToProps = {
  cleanAccountsCache,
}

type Props = {
  t: T,
  cleanAccountsCache: () => *,
}

type State = {
  opened: boolean,
}

class CleanButton extends PureComponent<Props, State> {
  state = {
    opened: false,
  }

  open = () => this.setState({ opened: true })

  close = () => this.setState({ opened: false })

  action = async () => {
    this.props.cleanAccountsCache()
    await delay(500)
    db.cleanCache()
    remote.getCurrentWindow().webContents.reload()
  }

  render() {
    const { t } = this.props
    const { opened } = this.state
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

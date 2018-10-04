// @flow

import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'
import type { T } from 'types/common'
import { openURL } from 'helpers/linking'
import { connect } from 'react-redux'
import { openModal } from 'reducers/modals'
import { MODAL_RELEASES_NOTES } from 'config/constants'
import Button from 'components/base/Button'

type Props = {
  t: T,
  openModal: Function,
}

const mapDispatchToProps = {
  openModal,
}

class ReleaseNotesButton extends PureComponent<Props> {
  handleOpenLink = (url: string) => openURL(url)

  render() {
    const { t, openModal } = this.props
    const version = __APP_VERSION__
    return (
      <Button
        small
        primary
        onClick={() => {
          openModal(MODAL_RELEASES_NOTES, version)
        }}
      >
        {t('settings.help.releaseNotesBtn')}
      </Button>
    )
  }
}

export default translate()(
  connect(
    null,
    mapDispatchToProps,
  )(ReleaseNotesButton),
)

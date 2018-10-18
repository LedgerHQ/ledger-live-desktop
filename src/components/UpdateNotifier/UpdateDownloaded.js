// @flow

import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'
import { compose } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { getUpdateStatus, getUpdateData } from 'reducers/update'
import { sendEvent } from 'renderer/events'
import type { State } from 'reducers'
import type { UpdateStatus } from 'reducers/update'

import { radii } from 'styles/theme'

import Box from 'components/base/Box'
import Text from 'components/base/Text'

import UpdateIcon from 'icons/Update'

import type { T } from 'types/common'

type Props = {
  t: T,
  updateStatus: UpdateStatus,
}

const mapStateToProps = (state: State) => ({
  updateStatus: getUpdateStatus(state),
  updateData: getUpdateData(state),
})

const Container = styled(Box).attrs({
  py: '8px',
  px: 3,
  bg: 'wallet',
  color: 'white',
  mt: '-50px',
  mb: '35px',
  style: p => ({
    transform: `translate3d(0, ${p.offset}%, 0)`,
  }),
})`
  border-radius: ${radii[1]}px;
`

const NotifText = styled(Text).attrs({
  ff: 'Open Sans|SemiBold',
  fontSize: 4,
})``

class UpdateDownloaded extends PureComponent<Props> {
  renderStatus() {
    const { updateStatus, t } = this.props
    switch (updateStatus) {
      case 'idle':
      case 'checking':
      case 'unavailable':
      case 'error':
      case 'available':
      case 'progress':
        return null
      case 'downloaded':
        return (
          <Box horizontal flow={3}>
            <UpdateIcon size={16} />
            <Box grow>
              <NotifText>{t('update.newVersionReady')}</NotifText>
            </Box>
            <Box>
              <NotifText
                style={{ cursor: 'pointer', textDecoration: 'underline' }}
                onClick={() => sendEvent('updater', 'quitAndInstall')}
              >
                {t('update.relaunch')}
              </NotifText>
            </Box>
          </Box>
        )
      default:
        return null
    }
  }

  render() {
    const { updateStatus, ...props } = this.props

    const isToggled = updateStatus === 'downloaded'

    if (!isToggled) {
      return null
    }
    return <Container {...props}>{this.renderStatus()}</Container>
  }
}

export default compose(
  connect(
    mapStateToProps,
    null,
  ),
  translate(),
)(UpdateDownloaded)

// @flow

import React, { PureComponent, Fragment } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import styled from 'styled-components'
import type { Account } from '@ledgerhq/live-common/lib/types'
import Tooltip from 'components/base/Tooltip'
import isAccountEmpty from 'helpers/isAccountEmpty'

import { MODAL_SEND, MODAL_RECEIVE, MODAL_SETTINGS_ACCOUNT } from 'config/constants'

import type { T } from 'types/common'

import { rgba } from 'styles/helpers'

import { openModal } from 'reducers/modals'

import IconAccountSettings from 'icons/AccountSettings'
import IconReceive from 'icons/Receive'
import IconSend from 'icons/Send'

import Box, { Tabbable } from 'components/base/Box'
import Button from 'components/base/Button'

const ButtonSettings = styled(Tabbable).attrs({
  align: 'center',
  justify: 'center',
  borderRadius: 1,
})`
  width: 40px;
  height: 40px;

  &:hover {
    color: ${p => (p.disabled ? '' : p.theme.colors.dark)};
    background: ${p => (p.disabled ? '' : rgba(p.theme.colors.fog, 0.2))};
  }

  &:active {
    background: ${p => (p.disabled ? '' : rgba(p.theme.colors.fog, 0.3))};
  }
`

const mapStateToProps = null

const mapDispatchToProps = {
  openModal,
}

type OwnProps = {
  account: Account,
}

type Props = OwnProps & {
  t: T,
  openModal: Function,
}

class AccountHeaderActions extends PureComponent<Props> {
  render() {
    const { account, openModal, t } = this.props
    return (
      <Box horizontal alignItems="center" justifyContent="flex-end" flow={2}>
        {!isAccountEmpty(account) ? (
          <Fragment>
            <Button small primary onClick={() => openModal(MODAL_SEND, { account })}>
              <Box horizontal flow={1} alignItems="center">
                <IconSend size={12} />
                <Box>{t('app:send.title')}</Box>
              </Box>
            </Button>

            <Button small primary onClick={() => openModal(MODAL_RECEIVE, { account })}>
              <Box horizontal flow={1} alignItems="center">
                <IconReceive size={12} />
                <Box>{t('app:receive.title')}</Box>
              </Box>
            </Button>
          </Fragment>
        ) : null}
        <Tooltip render={() => t('app:account.settings.title')}>
          <ButtonSettings onClick={() => openModal(MODAL_SETTINGS_ACCOUNT, { account })}>
            <Box justifyContent="center">
              <IconAccountSettings size={16} />
            </Box>
          </ButtonSettings>
        </Tooltip>
      </Box>
    )
  }
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  translate(),
)(AccountHeaderActions)

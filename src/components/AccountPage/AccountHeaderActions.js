// @flow

import React, { PureComponent, Fragment } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import styled from 'styled-components'
import type { Account, TokenAccount } from '@ledgerhq/live-common/lib/types'
import Tooltip from 'components/base/Tooltip'
import { isAccountEmpty } from '@ledgerhq/live-common/lib/account'

import { MODAL_SEND, MODAL_RECEIVE, MODAL_SETTINGS_ACCOUNT } from 'config/constants'

import type { T } from 'types/common'

import { rgba } from 'styles/helpers'

import { openModal } from 'reducers/modals'

import IconAccountSettings from 'icons/AccountSettings'
import IconReceive from 'icons/Receive'
import IconSend from 'icons/Send'

import Box, { Tabbable } from 'components/base/Box'
import Button from 'components/base/Button'
import Star from '../Stars/Star'

const ButtonSettings = styled(Tabbable).attrs({
  align: 'center',
  justify: 'center',
})`
  width: 34px;
  height: 34px;
  border: 1px solid ${p => p.theme.colors.grey};
  border-radius: 4px;
  &:hover {
    color: ${p => (p.disabled ? '' : p.theme.colors.dark)};
    background: ${p => (p.disabled ? '' : rgba(p.theme.colors.fog, 0.2))};
    border-color: ${p => p.theme.colors.dark};
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
  account: TokenAccount | Account,
  parentAccount: ?Account,
}

type Props = OwnProps & {
  t: T,
  openModal: Function,
}

class AccountHeaderActions extends PureComponent<Props> {
  render() {
    const { account, parentAccount, openModal, t } = this.props
    return (
      <Box horizontal alignItems="center" justifyContent="flex-end" flow={2}>
        {!isAccountEmpty(account) ? (
          <Fragment>
            <Button small primary onClick={() => openModal(MODAL_SEND, { parentAccount, account })}>
              <Box horizontal flow={1} alignItems="center">
                <IconSend size={12} />
                <Box>{t('send.title')}</Box>
              </Box>
            </Button>

            <Button
              small
              primary
              onClick={() => openModal(MODAL_RECEIVE, { parentAccount, account })}
            >
              <Box horizontal flow={1} alignItems="center">
                <IconReceive size={12} />
                <Box>{t('receive.title')}</Box>
              </Box>
            </Button>
          </Fragment>
        ) : null}
        <Tooltip render={() => t('stars.tooltip')}>
          <Star accountId={account.id} account={account} yellow />
        </Tooltip>
        {account.type === 'Account' ? (
          <Tooltip render={() => t('account.settings.title')}>
            <ButtonSettings
              onClick={() => openModal(MODAL_SETTINGS_ACCOUNT, { parentAccount, account })}
            >
              <Box justifyContent="center">
                <IconAccountSettings size={14} />
              </Box>
            </ButtonSettings>
          </Tooltip>
        ) : null}
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

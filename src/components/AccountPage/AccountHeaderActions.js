// @flow

import React, { useCallback } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import styled from 'styled-components'
import type { Account, TokenAccount } from '@ledgerhq/live-common/lib/types'
import Tooltip from 'components/base/Tooltip'
import { isAccountEmpty, canSend, getMainAccount } from '@ledgerhq/live-common/lib/account'
import { MODAL_SEND, MODAL_RECEIVE, MODAL_SETTINGS_ACCOUNT } from 'config/constants'
import type { T } from 'types/common'
import { rgba } from 'styles/helpers'
import { openModal } from 'reducers/modals'
import IconAccountSettings from 'icons/AccountSettings'
import perFamily from 'generated/AccountHeaderActions'
import Box, { Tabbable } from 'components/base/Box'
import Star from '../Stars/Star'
import { ReceiveActionDefault, SendActionDefault } from './AccountActionsDefault'
import perFamilyAccountActions from '../../generated/accountActions'

const ButtonSettings = styled(Tabbable).attrs(() => ({
  align: 'center',
  justify: 'center',
}))`
  width: 34px;
  height: 34px;
  border: 1px solid ${p => p.theme.colors.palette.text.shade60};
  border-radius: 4px;
  &:hover {
    color: ${p => (p.disabled ? '' : p.theme.colors.palette.text.shade100)};
    background: ${p => (p.disabled ? '' : rgba(p.theme.colors.palette.divider, 0.2))};
    border-color: ${p => p.theme.colors.palette.text.shade100};
  }

  &:active {
    background: ${p => (p.disabled ? '' : rgba(p.theme.colors.palette.divider, 0.3))};
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

const AccountHeaderActions = ({ account, parentAccount, openModal, t }: Props) => {
  const mainAccount = getMainAccount(account, parentAccount)
  const PerFamily = perFamily[mainAccount.currency.family]
  const decorators = perFamilyAccountActions[mainAccount.currency.family]
  const SendAction = (decorators && decorators.SendAction) || SendActionDefault
  const ReceiveAction = (decorators && decorators.ReceiveAction) || ReceiveActionDefault

  const onSend = useCallback(() => {
    openModal(MODAL_SEND, { parentAccount, account })
  }, [parentAccount, account, openModal])

  const onReceive = useCallback(() => {
    openModal(MODAL_RECEIVE, { parentAccount, account })
  }, [parentAccount, account, openModal])

  return (
    <Box horizontal alignItems="center" justifyContent="flex-end" flow={2}>
      {!isAccountEmpty(account) ? (
        <>
          {PerFamily ? <PerFamily account={account} parentAccount={parentAccount} /> : null}
          {canSend(account, parentAccount) ? (
            <SendAction account={account} parentAccount={parentAccount} onClick={onSend} />
          ) : null}

          <ReceiveAction account={account} parentAccount={parentAccount} onClick={onReceive} />
        </>
      ) : null}
      <Tooltip content={t('stars.tooltip')}>
        <Star accountId={account.id} account={account} yellow />
      </Tooltip>
      {account.type === 'Account' ? (
        <Tooltip content={t('account.settings.title')}>
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

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  translate(),
)(AccountHeaderActions)

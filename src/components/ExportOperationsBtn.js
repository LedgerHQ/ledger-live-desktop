// @flow
import React, { Component } from 'react'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { openModal } from 'reducers/modals'
import styled from 'styled-components'
import Box from 'components/base/Box'
import type { Account } from '@ledgerhq/live-common/lib/types/account'
import { createStructuredSelector } from 'reselect'
import { MODAL_EXPORT_OPERATIONS } from '../config/constants'
import DownloadCloud from '../icons/DownloadCloud'
import Label from './base/Label'
import Button from './base/Button'
import { activeAccountsSelector } from '../reducers/accounts'

const mapDispatchToProps = {
  openModal,
}

const mapStateToProps = createStructuredSelector({
  accounts: activeAccountsSelector,
})

class ExportOperationsBtn extends Component<{
  t: *,
  openModal: (string, any) => void,
  primary?: boolean,
  accounts: Account[],
}> {
  openModal = () => this.props.openModal(MODAL_EXPORT_OPERATIONS)
  render() {
    const { t, primary, accounts } = this.props
    if (!accounts.length && !primary) return null

    return primary ? (
      <Button small primary event="ExportLogs" disabled={!accounts.length} onClick={this.openModal}>
        {t('exportOperationsModal.cta')}
      </Button>
    ) : (
      <LabelWrapper onClick={this.openModal}>
        <Box mr={1}>
          <DownloadCloud />
        </Box>
        <span>{t('exportOperationsModal.title')}</span>
      </LabelWrapper>
    )
  }
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  translate(),
)(ExportOperationsBtn)

const LabelWrapper = styled(Label)`
  &:hover {
    color: ${p => p.theme.colors.wallet};
    cursor: pointer;
  }
  color: ${p => p.theme.colors.wallet};
  font-size: 13px;
  font-family: 'Inter', Arial;
  font-weight: 600;
`

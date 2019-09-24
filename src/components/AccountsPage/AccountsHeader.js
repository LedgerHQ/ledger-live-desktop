// @flow

import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { T, translate } from 'react-i18next'
import { connect } from 'react-redux'

import IconPlus from 'icons/Plus'
import Box from 'components/base/Box'
import Button from 'components/base/Button'
import { openModal } from 'reducers/modals'
import { MODAL_ADD_ACCOUNTS } from 'config/constants'

import OptionsButton from './OptionsButton'

type Props = {
  t: T,
  openModal: string => void,
}

const mapDispatchToProps = {
  openModal,
}

class AccountsHeader extends PureComponent<Props> {
  handleAddAccountModal = () => {
    this.props.openModal(MODAL_ADD_ACCOUNTS)
  }

  render() {
    const { t } = this.props
    return (
      <Box horizontal style={{ paddingBottom: 32 }}>
        <Box grow ff="Museo Sans|Regular" fontSize={7} color="dark" data-e2e="accountsPage_title">
          {t('accounts.title')}
        </Box>
        <Box horizontal flow={2} alignItems="center" justifyContent="flex-end">
          <Button small primary onClick={this.handleAddAccountModal} data-e2e="addAccount_button">
            <Box horizontal flow={1} alignItems="center">
              <IconPlus size={12} />
              <Box>{t('addAccounts.cta.add')}</Box>
            </Box>
          </Button>
          <OptionsButton />
        </Box>
      </Box>
    )
  }
}

export default compose(
  translate(),
  connect(
    null,
    mapDispatchToProps,
  ),
)(AccountsHeader)

// @flow

import React, { PureComponent } from 'react'
import Box from 'components/base/Box'
import { compose } from 'redux'
import { T, translate } from 'react-i18next'
import { connect } from 'react-redux'
import IconPlus from 'icons/Plus'
import Button from 'components/base/Button'
import { openModal } from 'reducers/modals'
import { MODAL_ADD_ACCOUNTS } from '../../config/constants'

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
      <Box horizontal pb={6}>
        <Box grow ff="Museo Sans|Regular" fontSize={7} color="dark">
          {t('accounts.title')}
        </Box>
        <Box>
          <Button small primary onClick={this.handleAddAccountModal}>
            <Box horizontal flow={1} alignItems="center">
              <IconPlus size={12} />
              <Box>{t('addAccounts.cta.add')}</Box>
            </Box>
          </Button>
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

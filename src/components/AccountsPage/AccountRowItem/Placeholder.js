// @flow

import React, { PureComponent } from 'react'
import Box from 'components/base/Box'
import { compose } from 'redux'
import { T, translate } from 'react-i18next'
import { connect } from 'react-redux'
import IconPlus from 'icons/Plus'
import { openModal } from 'reducers/modals'
import styled from 'styled-components'
import { MODAL_ADD_ACCOUNTS } from '../../../config/constants'

type Props = {
  t: T,
  openModal: string => void,
}

const mapDispatchToProps = {
  openModal,
}

const AddAccountButton = styled.div`
  border: 1px dashed rgba(153, 153, 153, 0.3);
  cursor: pointer;
  border-radius: 4px;
  padding: 20px;
  color: #abadb6;
  font-weight: 600;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: row;
  height: auto;

  &:hover {
    cursor: pointer;
    border-color: ${p => p.theme.colors.palette.text.shade100};
    color: ${p => p.theme.colors.palette.text.shade100};
  }
`

class Placeholder extends PureComponent<Props> {
  handleAddAccountModal = () => {
    this.props.openModal(MODAL_ADD_ACCOUNTS)
  }

  render() {
    const { t } = this.props
    return (
      <Box mb={5}>
        <AddAccountButton isAccountRow onClick={this.handleAddAccountModal} pb={6}>
          <IconPlus size={16} mr={20} />
          <Box ml={2} ff="Inter|Regular" fontSize={4}>
            {t('addAccounts.cta.add')}
          </Box>
        </AddAccountButton>
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
)(Placeholder)

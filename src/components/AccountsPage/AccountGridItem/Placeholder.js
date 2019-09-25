// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'
import styled from 'styled-components'

import { openModal } from 'reducers/modals'
import { MODAL_ADD_ACCOUNTS } from 'config/constants'
import type { T } from 'types/common'
import { i } from 'helpers/staticPath'
import Box from 'components/base/Box'
import Button from 'components/base/Button'

const Wrapper = styled(Box).attrs(() => ({
  p: 4,
  flex: 1,
  alignItems: 'center',
}))`
  border: 1px dashed ${p => p.theme.colors.palette.divider};
  border-radius: 4px;
  height: 215px;
`

class Placeholder extends PureComponent<{
  t: T,
  openModal: string => void,
}> {
  onAddAccounts = () => this.props.openModal(MODAL_ADD_ACCOUNTS)

  render() {
    const { t } = this.props
    return (
      <Box mb={5}>
        <Wrapper data-e2e="dashboard_AccountPlaceOrder">
          <Box mt={2}>
            <img alt="" src={i('empty-account-tile.svg')} />
          </Box>
          <Box
            ff="Open Sans"
            fontSize={3}
            color="palette.text.shade60"
            pb={2}
            mt={3}
            textAlign="center"
            style={{ maxWidth: 150 }}
          >
            {t('dashboard.emptyAccountTile.desc')}
          </Box>
          <Button primary onClick={this.onAddAccounts}>
            {t('dashboard.emptyAccountTile.createAccount')}
          </Button>
        </Wrapper>
      </Box>
    )
  }
}

export default translate()(
  connect(
    null,
    {
      openModal,
    },
  )(Placeholder),
)

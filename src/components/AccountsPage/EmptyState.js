// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import { push } from 'react-router-redux'

import { MODAL_ADD_ACCOUNTS } from 'config/constants'

import { openModal } from 'reducers/modals'
import type { T } from 'types/common'

import Box from 'components/base/Box'
import Image from 'components/base/Image'
import Button from 'components/base/Button'

const mapDispatchToProps = {
  openModal,
  push,
}

type Props = {
  t: T,
  push: Function,
  openModal: Function,
}

class EmptyState extends PureComponent<Props, *> {
  handleInstallApp = () => {
    const { push } = this.props
    const url = '/manager'
    push(url)
  }
  render() {
    const { t, openModal } = this.props

    return (
      <Box alignItems="center" pb={8} style={{ margin: 'auto' }}>
        <Image
          alt="emptyState Dashboard logo"
          resource="empty-state-accounts.svg"
          width="500"
          themeTyped
        />
        <Box mt={5} alignItems="center">
          <Title data-e2e="dashboard_empty_title">{t('emptyState.dashboard.title')}</Title>
          <Description mt={3} style={{ maxWidth: 600 }}>
            {t('emptyState.dashboard.desc')}
          </Description>
          <Box mt={5} horizontal style={{ width: 300 }} flow={3} justify="center">
            <Button
              primary
              style={{ minWidth: 120 }}
              onClick={this.handleInstallApp}
              data-e2e="dashboard_empty_OpenManager"
            >
              {t('emptyState.dashboard.buttons.installApp')}
            </Button>
            <Button
              outline
              style={{ minWidth: 120 }}
              onClick={() => openModal(MODAL_ADD_ACCOUNTS)}
              data-e2e="dashboard_empty_AddAccounts"
            >
              {t('emptyState.dashboard.buttons.addAccount')}
            </Button>
          </Box>
        </Box>
      </Box>
    )
  }
}

export const Title = styled(Box).attrs(() => ({
  ff: 'Inter|Regular',
  fontSize: 6,
  color: p => p.theme.colors.palette.text.shade100,
}))``

export const Description = styled(Box).attrs(() => ({
  ff: 'Inter|Regular',
  fontSize: 4,
  color: p => p.theme.colors.palette.text.shade80,
  textAlign: 'center',
}))``

export default compose(
  connect(
    null,
    mapDispatchToProps,
  ),
  translate(),
)(EmptyState)

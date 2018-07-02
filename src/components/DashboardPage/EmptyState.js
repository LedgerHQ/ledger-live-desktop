// @flow

import React, { PureComponent } from 'react'
import { i } from 'helpers/staticPath'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import { push } from 'react-router-redux'

import { MODAL_ADD_ACCOUNTS } from 'config/constants'

import { openModal } from 'reducers/modals'
import type { T } from 'types/common'

import Box from 'components/base/Box'
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
      <Box mt={7} alignItems="center">
        <img
          alt="emptyState Dashboard logo"
          src={i('empty-state-dashboard.svg')}
          width="413"
          height="157"
        />
        <Box mt={5} alignItems="center">
          <Title>{t('app:emptyState.dashboard.title')}</Title>
          <Description mt={3} style={{ maxWidth: 600 }}>
            {t('app:emptyState.dashboard.desc')}
          </Description>
          <Box mt={5} horizontal style={{ width: 300 }} flow={3} justify="center">
            <Button primary style={{ minWidth: 120 }} onClick={this.handleInstallApp}>
              {t('app:emptyState.dashboard.buttons.installApp')}
            </Button>
            <Button outline style={{ minWidth: 120 }} onClick={() => openModal(MODAL_ADD_ACCOUNTS)}>
              {t('app:emptyState.dashboard.buttons.addAccount')}
            </Button>
          </Box>
        </Box>
      </Box>
    )
  }
}

export const Title = styled(Box).attrs({
  ff: 'Museo Sans|Regular',
  fontSize: 6,
  color: p => p.theme.colors.dark,
})``

export const Description = styled(Box).attrs({
  ff: 'Open Sans|Regular',
  fontSize: 4,
  color: p => p.theme.colors.graphite,
  textAlign: 'center',
})``

export default compose(
  connect(
    null,
    mapDispatchToProps,
  ),
  translate(),
)(EmptyState)

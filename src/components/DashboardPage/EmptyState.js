// @flow

import React, { PureComponent } from 'react'
import { i } from 'helpers/staticPath'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import { push } from 'react-router-redux'

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
          src={i('logos/emptyStateDashboard.png')}
          width="413"
          height="157"
        />
        <Box mt={5} alignItems="center">
          <Title>{t('app:emptyState.dashboard.title')}</Title>
          <Description>{t('app:emptyState.dashboard.desc')}</Description>
          <Box mt={3} horizontal justifyContent="space-around" style={{ width: 300 }}>
            <Button
              padded
              primary
              style={{ width: 120 }}
              onClick={() => openModal('importAccounts')}
            >
              {t('app:emptyState.dashboard.buttons.addAccount')}
            </Button>
            <Button padded primary style={{ width: 120 }} onClick={this.handleInstallApp}>
              {t('app:emptyState.dashboard.buttons.installApp')}
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
})`
  margin: 10px auto 25px;
`
export default compose(
  connect(
    null,
    mapDispatchToProps,
  ),
  translate(),
)(EmptyState)

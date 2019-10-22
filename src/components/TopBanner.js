// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import Box from 'components/base/Box'
import IconCross from 'icons/Cross'
import { createStructuredSelector } from 'reselect'
import { radii } from 'styles/theme'

import { dismissBanner } from '../actions/settings'
import { dismissedBannersSelector } from '../reducers/settings'

export type Content = {
  Icon?: React$ComponentType<any>,
  message: React$Node,
  right?: React$Node,
}

type Props = {
  content?: Content,
  status: string,
  dismissable?: boolean,
  bannerId?: string,
  dismissedBanners: string[],
  dismissBanner: string => void,
}

const mapStateToProps = createStructuredSelector({
  dismissedBanners: dismissedBannersSelector,
})

const mapDispatchToProps = {
  dismissBanner,
}

class TopBanner extends PureComponent<Props> {
  static defaultProps = {
    status: '',
    dismissable: false,
  }

  onDismiss = () => {
    const { bannerId, dismissBanner } = this.props

    if (bannerId) {
      dismissBanner(bannerId)
    }
  }

  render() {
    const { dismissedBanners, bannerId, dismissable, content, status } = this.props

    if (!content || (bannerId && dismissedBanners.includes(bannerId))) return null

    const { Icon, message, right } = content

    return (
      <Container status={status}>
        {Icon && (
          <IconContainer>
            <Icon size={16} />
          </IconContainer>
        )}
        {message}
        <RightContainer>{right}</RightContainer>
        {dismissable && (
          <CloseContainer onClick={this.onDismiss}>
            <IconCross size={14} />
          </CloseContainer>
        )}
      </Container>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TopBanner)

const IconContainer = styled.div`
  margin-right: 15px;
  display: flex;
  align-items: center;
`

const Container = styled(Box).attrs(p => ({
  horizontal: true,
  align: 'center',
  py: '8px',
  px: 3,
  bg: p.theme.colors[p.status] || 'palette.primary.main',
  color: 'palette.primary.contrastText',
  mt: -32,
  mb: 20,
  fontSize: 4,
  ff: 'Inter|SemiBold',
}))`
  border-radius: ${radii[1]}px;
`

const RightContainer = styled.div`
  margin-left: auto;
`

export const FakeLink = styled.span`
  color: ${p => p.theme.colors.palette.primary.contrastText};
  text-decoration: underline;
  cursor: pointer;
`

const CloseContainer = styled(Box).attrs(() => ({
  color: 'palette.primary.contrastText',
}))`
  z-index: 1;
  margin-left: 10px;
  cursor: pointer;
  &:hover {
    color: #eee;
  }

  &:active {
    color: #eee;
  }
`

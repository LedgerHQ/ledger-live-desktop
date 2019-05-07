// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import Box from 'components/base/Box'
import Text from 'components/base/Text'
import IconCross from 'icons/Cross'
import { colors } from 'styles/theme'
import { rgba } from '../styles/helpers'

const NewUpdateNoticeDismissButton = styled(Box)`
  position: absolute;
  top: 4px;
  right: 4px;
  color: white;
  opacity: 0.8;
  &:hover {
    cursor: pointer;
  }
`

const NewUpdateNoticeWrapper = styled(Box)`
  border-radius: 4px;
  background: ${p => p.theme.colors.wallet};
  padding: 10px 16px;
  animation: slide-top 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  @keyframes slide-top {
    0% {
      transform: translateY(300px);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
`

class NewUpdateNotice extends PureComponent<{
  title: React$Node,
  description: React$Node,
  callback: () => any,
}> {
  render() {
    const { title, description, callback } = this.props
    return (
      <NewUpdateNoticeWrapper>
        <NewUpdateNoticeDismissButton onClick={callback}>
          <IconCross size={12} />
        </NewUpdateNoticeDismissButton>
        <Text ff="Open Sans|SemiBold" color="white" fontSize={'10px'}>
          {title && title}
        </Text>
        <Text ff="Open Sans" color={rgba(colors.white, 0.8)} fontSize={'10px'}>
          {description}
        </Text>
      </NewUpdateNoticeWrapper>
    )
  }
}

export default NewUpdateNotice

// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import Box from 'components/base/Box'
import Text from 'components/base/Text'
import IconCross from 'icons/Cross'

const NewUpdateNoticeDismissButton = styled(Box)`
  position: absolute;
  top: 0;
  right: 0;
  padding: 8px;
  color: ${p => p.theme.colors.palette.background.paper};
  opacity: 0.5;
  &:hover {
    cursor: pointer;
  }
`

const NewUpdateNoticeWrapper = styled(Box)`
  border-radius: 4px;
  background: ${p => p.theme.colors.wallet};
  padding: 10px 16px;
  animation: ${p => (p.reverse ? 'out-anim' : 'in-anim')} ${p => (p.reverse ? '0.4s' : '0.8s')}
    cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  position: relative;

  @keyframes in-anim {
    0% {
      transform: translateY(160px);
      opacity: 0;
    }
    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
  @keyframes out-anim {
    0% {
      transform: translateY(0);
      opacity: 1;
    }
    100% {
      transform: translateY(40px);
      opacity: 0;
    }
  }
`

class NewUpdateNotice extends PureComponent<{
  title: React$Node,
  description: React$Node,
  callback: () => any,
  reverse: boolean,
}> {
  render() {
    const { title, description, callback, reverse } = this.props
    return (
      <NewUpdateNoticeWrapper reverse={reverse}>
        <NewUpdateNoticeDismissButton onClick={callback}>
          <IconCross size={12} />
        </NewUpdateNoticeDismissButton>
        <Text
          ff="Inter|SemiBold"
          color="palette.background.paper"
          fontSize="10px"
          style={{
            textTransform: 'uppercase',
            marginBottom: 4,
          }}
        >
          {title}
        </Text>
        <Text ff="Inter" color="palette.background.paper" fontSize="10px">
          {description}
        </Text>
      </NewUpdateNoticeWrapper>
    )
  }
}

export default NewUpdateNotice

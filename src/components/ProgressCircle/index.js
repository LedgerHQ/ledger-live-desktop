// @flow

import React from 'react'
import styled, { css, keyframes } from 'styled-components'
import useTheme from 'hooks/useTheme'

import Text from 'components/base/Text'

const STROKE_WIDTH = 4

type Props = {
  progress: number,
  size: number,
}

const animIndeterminate = keyframes`
  0% {
  }
  50% {
  }
  100% {
  }
`

const InnerCircle = styled.circle`
  transform-origin: 50% 50%;
  ${p =>
    p.progress === 0
      ? css`
          animation: ${animIndeterminate} 3s cubic-bezier(0.61, 0.01, 0.39, 1.03) infinite;
        `
      : css`
          transition: stroke-dashoffset 0.35s;
          transform: rotate(-90deg);
        `};
`

const Container = styled.div`
  position: relative;
  width: ${p => p.size}px;
  height: ${p => p.size}px;
`

const TextContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ProgressCircle = ({ size, progress }: Props) => {
  const radius = size / 2
  const normalizedRadius = radius - STROKE_WIDTH / 2
  const circumference = normalizedRadius * 2 * Math.PI
  const strokeDashoffset = circumference - progress * circumference

  return (
    <Container size={size}>
      <TextContainer>
        <Text
          ff="Inter|Regular"
          color={progress === 0 ? 'palette.text.shade80' : 'wallet'}
          fontSize={5}
        >
          {`${Math.round(progress * 100)}%`}
        </Text>
      </TextContainer>
      <svg height={size} width={size}>
        <circle
          stroke={useTheme('colors.palette.text.shade40')}
          fill="transparent"
          strokeWidth={STROKE_WIDTH}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <InnerCircle
          progress={progress}
          stroke={useTheme('colors.wallet')}
          fill="transparent"
          strokeWidth={STROKE_WIDTH}
          strokeDasharray={`${circumference} ${circumference}`}
          style={{ strokeDashoffset }}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
    </Container>
  )
}

export default ProgressCircle

// @flow

import React from 'react'
import styled from 'styled-components'
import Tooltip from 'components/base/Tooltip'

import { radii, colors } from 'styles/theme'
import { rgba } from 'styles/helpers'

import Box from 'components/base/Box'
import Spinner from 'components/base/Spinner'
import IconCheck from 'icons/Check'
import IconCross from 'icons/Cross'
import IconRecover from 'icons/Recover'

export const DeviceInteractionStepContainer = styled(Box).attrs({
  horizontal: true,
  ff: 'Open Sans',
  fontSize: 3,
  bg: 'white',
  color: 'graphite',
})`
  position: relative;
  z-index: ${p => (p.isActive ? 1 : '')};
  max-width: 500px;
  min-height: 80px;
  border: 1px solid ${p => p.theme.colors.fog};
  border-color: ${p =>
    p.isError ? p.theme.colors.alertRed : p.isActive || p.isSuccess ? p.theme.colors.wallet : ''};
  border-top-color: ${p => (p.isFirst || p.isActive ? '' : 'transparent')};
  border-bottom-color: ${p => (p.isPrecedentActive ? 'transparent' : '')};
  border-bottom-left-radius: ${p => (p.isLast ? `${radii[1]}px` : 0)};
  border-bottom-right-radius: ${p => (p.isLast ? `${radii[1]}px` : 0)};
  border-top-left-radius: ${p => (p.isFirst ? `${radii[1]}px` : 0)};
  border-top-right-radius: ${p => (p.isFirst ? `${radii[1]}px` : 0)};
  box-shadow: ${p =>
    p.isActive && !p.isSuccess
      ? `
    ${rgba(p.isError ? p.theme.colors.alertRed : p.theme.colors.wallet, 0.2)} 0 0 3px 2px
  `
      : 'none'};

  &:after {
    content: '';
    position: absolute;
    left: -2px;
    top: 0;
    bottom: 0;
    width: 2px;
    box-shadow: ${p =>
      p.isActive && !p.isSuccess
        ? `${p.theme.colors[p.isError ? 'alertRed' : 'wallet']} 2px 0 0`
        : 'none'};
  }
`

export const IconContainer = ({ children }: { children: any }) => (
  <Box align="center" justify="center" style={{ width: 70 }}>
    {children}
  </Box>
)

const SpinnerContainerWrapper = styled(Box).attrs({
  justify: 'center',
  color: 'dark',
  align: 'center',
})`
  position: absolute;
  top: 0px;
  right: 20px;
  bottom: 0;
  padding-left: 15px;
  overflow: hidden;
  pointer-events: none;
`

const SpinnerContainerInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 0;
  border-left: none;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  transition: 750ms cubic-bezier(0.62, 0.28, 0.39, 0.94);
  transition-property: transform opacity;
  opacity: ${p => (p.isVisible && !p.isPassed ? 1 : 0)};
  transform: translate3d(0, ${p => (p.isPassed || p.isError ? -40 : 0)}px, 0);
  color: grey;
`

export const SpinnerContainer = ({
  isVisible,
  isPassed,
  isError,
}: {
  isVisible: boolean,
  isPassed: boolean,
  isError: boolean,
}) => (
  <SpinnerContainerWrapper>
    <SpinnerContainerInner isVisible={isVisible} isPassed={isPassed} isError={isError}>
      <Spinner size={24} />
    </SpinnerContainerInner>
  </SpinnerContainerWrapper>
)

const SuccessContainerInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 0;
  border-left: none;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  transition: 350ms cubic-bezier(0.62, 0.28, 0.39, 0.94);
  transition-property: transform opacity;
  transition-delay: 180ms;
  opacity: ${p => (p.isVisible ? 1 : 0)};
  transform: translate3d(0, ${p => (p.isVisible ? 0 : 40)}px, 0);
`

export const SuccessContainer = ({ isVisible }: { isVisible: boolean }) => (
  <Box p={4} color="wallet" align="center" justify="center" pl={0} overflow="hidden">
    <SuccessContainerInner isVisible={isVisible}>
      <IconCheck size={16} />
    </SuccessContainerInner>
  </Box>
)

export const ErrorContainer = () => (
  <Box
    p={4}
    color="alertRed"
    align="center"
    justify="center"
    pl={0}
    sticky
    style={{ left: 'auto' }}
  >
    <IconCross size={16} />
  </Box>
)

const ErrorRetryContainer = styled(Box).attrs({
  grow: 1,
  color: 'alertRed',
  cursor: 'pointer',
  p: 1,
  align: 'center',
  justify: 'center',
  overflow: 'hidden',
})`
  &:hover {
    background-color: ${() => rgba(colors.alertRed, 0.1)};
  }
  &:active {
    background-color: ${() => rgba(colors.alertRed, 0.15)};
  }
`

export const ErrorDescContainer = ({
  error,
  onRetry,
  ...p
}: {
  error: Error,
  onRetry: void => void,
}) => (
  <Box
    pl={0}
    color="alertRed"
    align="flex-start"
    justify="center"
    style={{
      cursor: 'text',
    }}
    {...p}
  >
    <Box horizontal bg={rgba(colors.alertRed, 0.1)} borderRadius={1}>
      <Box p={1} pl={2}>
        {error.message || 'Failed'}
      </Box>
      <Tooltip render={() => 'Retry'} style={{ display: 'flex', alignItems: 'center' }}>
        <ErrorRetryContainer onClick={onRetry}>
          <IconRecover size={12} />
        </ErrorRetryContainer>
      </Tooltip>
    </Box>
  </Box>
)

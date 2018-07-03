// @flow

import React from 'react'
import styled from 'styled-components'

import { radii } from 'styles/theme'
import { rgba } from 'styles/helpers'

import TranslatedError from 'components/TranslatedError'
import Box from 'components/base/Box'
import FakeLink from 'components/base/FakeLink'
import Spinner from 'components/base/Spinner'
import IconCheck from 'icons/Check'
import IconCross from 'icons/Cross'
import IconExclamationCircle from 'icons/ExclamationCircle'

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
`

export const IconContainer = ({
  children,
  isTransparent,
}: {
  children: any,
  isTransparent: boolean,
}) => (
  <Box
    align="center"
    justify="center"
    color="dark"
    style={{
      width: 70,
      opacity: isTransparent ? 0.5 : 1,
    }}
  >
    {children}
  </Box>
)

const SpinnerContainerWrapper = styled.div`
  color: ${p => p.theme.colors.grey};
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 300ms cubic-bezier(0.62, 0.28, 0.39, 0.94);
  transition-property: transform opacity;
  opacity: ${p => (p.isVisible ? 1 : 0)};
  transform: translate3d(0, ${p => (!p.isVisible ? -20 : 0)}px, 0);
`

export const SpinnerContainer = ({ isVisible }: { isVisible: boolean }) => (
  <SpinnerContainerWrapper isVisible={isVisible}>
    <Spinner size={16} />
  </SpinnerContainerWrapper>
)

const SuccessContainerWrapper = styled(SpinnerContainerWrapper)`
  color: ${p => p.theme.colors.wallet};
  transform: translate3d(0, ${p => (!p.isVisible ? 20 : 0)}px, 0);
`

export const SuccessContainer = ({ isVisible }: { isVisible: boolean }) => (
  <SuccessContainerWrapper isVisible={isVisible}>
    <IconCheck size={16} />
  </SuccessContainerWrapper>
)

const ErrorContainerWrapper = styled(SpinnerContainerWrapper)`
  color: ${p => p.theme.colors.alertRed};
  transform: translate3d(0, ${p => (!p.isVisible ? 20 : 0)}px, 0);
`

export const ErrorContainer = ({ isVisible }: { isVisible: boolean }) => (
  <ErrorContainerWrapper isVisible={isVisible}>
    <IconCross size={16} />
  </ErrorContainerWrapper>
)

export const ErrorDescContainer = ({
  error,
  onRetry,
  ...p
}: {
  error: Error,
  onRetry: void => void,
}) => (
  <Box
    horizontal
    fontSize={3}
    color="alertRed"
    align="center"
    cursor="text"
    ff="Open Sans|SemiBold"
    style={{ maxWidth: 500 }}
    {...p}
  >
    <IconExclamationCircle size={16} />
    <Box ml={2} mr={1} shrink grow style={{ maxWidth: 300 }}>
      <TranslatedError error={error} />
    </Box>
    <FakeLink ml="auto" underline color="alertRed" onClick={onRetry}>
      {'Retry'}
    </FakeLink>
  </Box>
)

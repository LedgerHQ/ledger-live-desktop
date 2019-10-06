// @flow

import React from 'react'
import styled from 'styled-components'
import { translate } from 'react-i18next'

import type { T } from 'types/common'

import { radii } from 'styles/theme'
import { openURL } from 'helpers/linking'
import { urls } from 'config/urls'

import TranslatedError from 'components/TranslatedError'
import Box from 'components/base/Box'
import FakeLink from 'components/base/FakeLink'
import Spinner from 'components/base/Spinner'
import IconCheck from 'icons/Check'
import IconCross from 'icons/Cross'
import IconExclamationCircle from 'icons/ExclamationCircle'
import IconSmoothBorders from 'icons/SmoothBorders'

export const DeviceInteractionStepContainer = styled(Box).attrs(() => ({
  horizontal: true,
  ff: 'Inter',
  fontSize: 3,
  color: 'palette.text.shade80',
}))`
  position: relative;
  z-index: ${p => (p.isActive ? 1 : '')};
  max-width: 500px;
  min-height: 80px;
  border: 1px solid ${p => p.theme.colors.palette.divider};
  border-color: ${p =>
    p.isError ? p.theme.colors.alertRed : p.isActive && !p.isFinished ? p.theme.colors.wallet : ''};
  border-top-color: ${p => (p.isFirst || p.isActive ? '' : 'transparent')};
  border-bottom-color: ${p => (p.isPrecedentActive ? 'transparent' : '')};
  border-bottom-left-radius: ${p => (p.isLast ? `${radii[1]}px` : 0)};
  border-bottom-right-radius: ${p => (p.isLast ? `${radii[1]}px` : 0)};
  border-top-left-radius: ${p => (p.isFirst ? `${radii[1]}px` : 0)};
  border-top-right-radius: ${p => (p.isFirst ? `${radii[1]}px` : 0)};
`

const AbsCenter = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`

const smoothBorders = <IconSmoothBorders size={28} />

export const IconContainer = ({
  children,
  isTransparent,
}: {
  children: any,
  isTransparent: boolean,
}) => (
  <Box
    relative
    color="palette.text.shade100"
    style={{
      width: 70,
      opacity: isTransparent ? 0.5 : 1,
    }}
  >
    <AbsCenter>{smoothBorders}</AbsCenter>
    <AbsCenter>{children}</AbsCenter>
  </Box>
)

const SpinnerContainerWrapper = styled.div`
  color: ${p => p.theme.colors.palette.text.shade60};
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

export const ErrorDescContainer = translate()(
  ({ error, onRetry, t, ...p }: { error: Error, onRetry: void => void, t: T }) => {
    const errorHelpURL = urls.errors[error.name] || null
    return (
      <Box
        horizontal
        fontSize={3}
        color="alertRed"
        align="flex-start"
        cursor="text"
        ff="Inter|SemiBold"
        style={{ maxWidth: 500 }}
        {...p}
      >
        <IconExclamationCircle size={16} />
        <Box ml={2} mr={1} shrink grow style={{ maxWidth: 300 }}>
          <TranslatedError error={error} />
          <Box ff="Inter|Regular" mt={1}>
            <TranslatedError error={error} field="description" />
          </Box>
        </Box>
        <Box ml="auto" horizontal flow={2}>
          {!!errorHelpURL && (
            <FakeLink underline color="alertRed" onClick={() => openURL(errorHelpURL)}>
              {t('common.help')}
            </FakeLink>
          )}
          <FakeLink underline color="alertRed" onClick={onRetry}>
            {t('common.retry')}
          </FakeLink>
        </Box>
      </Box>
    )
  },
)

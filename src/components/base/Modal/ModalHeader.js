// @flow

import React from 'react'
import styled from 'styled-components'
import { translate } from 'react-i18next'

import type { T } from 'types/common'

import Box from 'components/base/Box'
import Text from 'components/base/Text'
import IconAngleLeft from 'icons/AngleLeft'
import IconCross from 'icons/Cross'

const MODAL_HEADER_STYLE = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 20,
}

const ModalTitle = styled(Box).attrs(() => ({
  color: 'palette.text.shade100',
  ff: 'Inter|Medium',
  fontSize: 6,
  grow: true,
  shrink: true,
}))`
  text-align: center;
  line-height: 1;
`

const ModalHeaderAction = styled(Box).attrs(() => ({
  horizontal: true,
  align: 'center',
  fontSize: 3,
  p: 4,
}))`
  color: ${p => p.color || p.theme.colors.palette.text.shade60};
  position: absolute;
  top: 0;
  left: ${p => (p.right ? 'auto' : 0)};
  right: ${p => (p.right ? 0 : 'auto')};
  line-height: 0;
  cursor: pointer;

  &:hover,
  &:hover ${Text} {
    color: ${p => p.theme.colors.palette.text.shade80};
  }

  &:active,
  &:active ${Text} {
    color: ${p => p.theme.colors.palette.text.shade100};
  }

  ${Text} {
    border-bottom: 1px dashed transparent;
  }
  &:focus span {
    border-bottom-color: inherit;
  }
`

const ModalHeader = ({
  children,
  onBack,
  onClose,
  t,
}: {
  children: any,
  onBack: void => void,
  onClose: void => void,
  t: T,
}) => (
  <div style={MODAL_HEADER_STYLE}>
    {onBack && (
      <ModalHeaderAction onClick={onBack}>
        <IconAngleLeft size={12} />
        <Text ff="Inter|Medium" fontSize={4} color="palette.text.shade40">
          {t('common.back')}
        </Text>
      </ModalHeaderAction>
    )}
    <ModalTitle data-e2e="modalTitle">{children}</ModalTitle>
    {onClose && (
      <ModalHeaderAction right color="palette.text.shade40" onClick={onClose}>
        <IconCross size={16} />
      </ModalHeaderAction>
    )}
  </div>
)

export default translate()(ModalHeader)

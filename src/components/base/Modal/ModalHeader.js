// @flow

import React from 'react'
import styled from 'styled-components'
import { translate } from 'react-i18next'

import type { T } from 'types/common'

import Box from 'components/base/Box'
import Text from 'components/base/Text'
import IconAngleLeft from 'icons/AngleLeft'
import IconCross from 'icons/Cross'
import Tabbable from '../Box/Tabbable'

const MODAL_HEADER_STYLE = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: 10,
  position: 'relative',
  flexDirection: 'row',
}

const ModalTitle = styled(Box).attrs(() => ({
  color: 'palette.text.shade100',
  ff: 'Inter|Medium',
  fontSize: 6,
}))`
  position: absolute;
  left: 0;
  right: 0;
  text-align: center;
  line-height: 1;
  pointer-events: none;
`

const ModalHeaderAction = styled(Tabbable).attrs(() => ({
  horizontal: true,
  align: 'center',
  fontSize: 3,
  p: 3,
}))`
  border-radius: 8px;
  color: ${p => p.color || p.theme.colors.palette.text.shade60};
  top: 0;
  align-self: ${p => (p.right ? 'flex-end' : 'flex-start')};
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
    border-bottom-color: none;
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
    {onBack ? (
      <ModalHeaderAction onClick={onBack}>
        <IconAngleLeft size={12} />
        <Text ff="Inter|Medium" fontSize={4} color="palette.text.shade40">
          {t('common.back')}
        </Text>
      </ModalHeaderAction>
    ) : (
      <div />
    )}
    <ModalTitle data-e2e="modalTitle">{children}</ModalTitle>
    {onClose ? (
      <ModalHeaderAction right color="palette.text.shade40" onClick={onClose}>
        <IconCross size={16} />
      </ModalHeaderAction>
    ) : (
      <div />
    )}
  </div>
)

export default translate()(ModalHeader)

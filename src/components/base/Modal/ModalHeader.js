// @flow

import React from 'react'
import styled from 'styled-components'
import { translate } from 'react-i18next'

import type { T } from 'types/common'

import Box from 'components/base/Box'

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

const iconAngleLeft = <IconAngleLeft size={16} />
const iconCross = <IconCross size={16} />

const ModalHeaderAction = styled(Box).attrs(() => ({
  horizontal: true,
  align: 'center',
  fontSize: 3,
  p: 4,
  color: 'palette.text.shade60',
}))`
  position: absolute;
  top: 0;
  left: ${p => (p.right ? 'auto' : 0)};
  right: ${p => (p.right ? 0 : 'auto')};
  line-height: 0;
  cursor: pointer;

  &:hover {
    color: ${p => p.theme.colors.palette.text.shade80};
  }

  &:active {
    color: ${p => p.theme.colors.palette.text.shade100};
  }

  span {
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
        {iconAngleLeft}
        <span>{t('common.back')}</span>
      </ModalHeaderAction>
    )}
    <ModalTitle data-e2e="modalTitle">{children}</ModalTitle>
    {onClose && (
      <ModalHeaderAction right color="palette.divider" onClick={onClose}>
        {iconCross}
      </ModalHeaderAction>
    )}
  </div>
)

export default translate()(ModalHeader)

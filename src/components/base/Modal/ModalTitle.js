// @flow

import React from 'react'
import styled from 'styled-components'
import { translate } from 'react-i18next'

import type { T } from 'types/common'

import Box from 'components/base/Box'
import IconAngleLeft from 'icons/AngleLeft'

const Container = styled(Box).attrs({
  alignItems: 'center',
  color: 'dark',
  ff: 'Museo Sans|Regular',
  fontSize: 6,
  justifyContent: 'center',
  p: 5,
  relative: true,
})``

const Back = styled(Box).attrs({
  unstyled: true,
  horizontal: true,
  align: 'center',
  color: 'grey',
  ff: 'Open Sans',
  fontSize: 3,
  p: 4,
})`
  cursor: pointer;
  position: absolute;
  line-height: 1;
  top: 0;
  left: 0;

  &:hover {
    color: ${p => p.theme.colors.graphite};
  }

  &:active {
    color: ${p => p.theme.colors.dark};
  }

  span {
    border-bottom: 1px dashed transparent;
  }
  &:focus span {
    border-bottom-color: inherit;
  }
`

function ModalTitle({
  t,
  onBack,
  children,
  ...props
}: {
  t: T,
  onBack: any => void,
  children: any,
}) {
  return (
    <Container {...props}>
      {onBack && (
        <Back onClick={onBack}>
          <IconAngleLeft size={16} />
          <span>{t('app:common.back')}</span>
        </Back>
      )}
      {children}
    </Container>
  )
}

export default translate()(ModalTitle)

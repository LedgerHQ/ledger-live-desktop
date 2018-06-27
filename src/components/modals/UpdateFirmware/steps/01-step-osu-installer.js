// @flow

import React from 'react'
import styled from 'styled-components'

import Box from 'components/base/Box'
import Text from 'components/base/Text'
import Button from 'components/base/Button'
import DeviceConfirm from 'components/DeviceConfirm'

import type { StepProps } from '../'

const Container = styled(Box).attrs({
  alignItems: 'center',
  fontSize: 4,
  color: 'dark',
  px: 7,
})``

const Title = styled(Box).attrs({
  ff: 'Museo Sans|Regular',
  fontSize: 5,
  mb: 3,
})``

const Address = styled(Box).attrs({
  bg: p => (p.notValid ? 'transparent' : p.withQRCode ? 'white' : 'lightGrey'),
  borderRadius: 1,
  color: 'dark',
  ff: 'Open Sans|SemiBold',
  fontSize: 4,
  mt: 2,
  px: p => (p.notValid ? 0 : 4),
  py: p => (p.notValid ? 0 : 3),
})`
  border: ${p => (p.notValid ? 'none' : `1px dashed ${p.theme.colors.fog}`)};
  cursor: text;
  user-select: text;
  width: 325px;
`

const Ellipsis = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
`

// TODO: Change to class component and add osu firmware install
function StepOSUInstaller({ t, firmware }: StepProps) {
  return (
    <Container>
      <Title>{t('app:manager.modal.confirmIdentifier')}</Title>
      <Text ff="Open Sans|Regular" align="center" color="smoke">
        {t('app:manager.modal.confirmIdentifierText')}
      </Text>
      <Box mx={7} mt={5}>
        <Text ff="Open Sans|SemiBold" align="center" color="smoke">
          {t('app:manager.modal.identifier')}
        </Text>
        <Address>
          <Ellipsis>{firmware && firmware.hash}</Ellipsis>
        </Address>
      </Box>
      <Box mt={5}>
        <DeviceConfirm />
      </Box>
    </Container>
  )
}

export default StepOSUInstaller

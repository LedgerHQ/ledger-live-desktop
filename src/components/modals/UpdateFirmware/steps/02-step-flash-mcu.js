// @flow

import React from 'react'
import styled from 'styled-components'

import { i } from 'helpers/staticPath'

import Box from 'components/base/Box'
import Text from 'components/base/Text'

import type { StepProps } from '../'

const Container = styled(Box).attrs({
  alignItems: 'center',
  fontSize: 4,
  color: 'dark',
})``

const Title = styled(Box).attrs({
  ff: 'Museo Sans|Regular',
  fontSize: 5,
  mb: 3,
})``

const Bullet = styled.span`
  font-weight: 600;
  color: #142533;
`

const Separator = styled(Box).attrs({
  color: 'fog',
})`
  height: 1px;
  width: 100%;
  background-color: currentColor;
`

// TODO: Change to class component and add flash mcu and final
function StepFlashMcu({ t }: StepProps) {
  return (
    <Container>
      <Title>{t('app:manager.modal.mcuTitle')}</Title>
      <Box mx={7}>
        <Text ff="Open Sans|Regular" align="center" color="smoke">
          <Bullet>{'1.'}</Bullet>
          {t('app:manager.modal.mcuFirst')}
        </Text>
        <img
          src={i('logos/unplugDevice.png')}
          style={{ width: '100%', maxWidth: 330, marginTop: 30 }}
          alt={t('app:manager.modal.mcuFirst')}
        />
      </Box>
      <Separator my={6} />
      <Box mx={7}>
        <Text ff="Open Sans|Regular" align="center" color="smoke">
          <Bullet>{'2.'}</Bullet>
          {t('app:manager.modal.mcuSecond')}
        </Text>
        <img
          src={i('logos/unplugDevice.png')}
          style={{ width: '100%', maxWidth: 330, marginTop: 30 }}
          alt={t('app:manager.modal.mcuFirst')}
        />
      </Box>
    </Container>
  )
}

export default StepFlashMcu

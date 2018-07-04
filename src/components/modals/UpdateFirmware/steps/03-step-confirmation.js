// @flow

import React from 'react'
import styled from 'styled-components'

import TrackPage from 'analytics/TrackPage'
import Box from 'components/base/Box'
import Text from 'components/base/Text'
import Button from 'components/base/Button'
import CheckCircle from 'icons/CheckCircle'

import type { StepProps } from '../'

const Container = styled(Box).attrs({
  alignItems: 'center',
  fontSize: 4,
  color: 'dark',
})``

const Title = styled(Box).attrs({
  fontFamily: 'Museo Sans',
  fontSize: 6,
  color: 'dark',
})`
  font-weight: 500;
`

function StepConfirmation({ t }: StepProps) {
  return (
    <Container>
      <TrackPage category="Manager" name="FirmwareConfirmation" />
      <Box mx={7} color="positiveGreen" my={4}>
        <CheckCircle size={44} />
      </Box>
      <Title>{t('app:manager.modal.successTitle')}</Title>
      <Box mt={2} mb={5}>
        <Text ff="Open Sans|Regular" fontSize={4} color="graphite">
          {t('app:manager.modal.successText')}
        </Text>
      </Box>
      <Box mx={7} />
    </Container>
  )
}

export function StepConfirmFooter({ t, onCloseModal }: StepProps) {
  return (
    <Button primary onClick={onCloseModal}>
      {t('app:common.close')}
    </Button>
  )
}

export default StepConfirmation

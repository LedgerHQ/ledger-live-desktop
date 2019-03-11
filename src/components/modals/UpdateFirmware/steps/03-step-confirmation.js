// @flow

import React from 'react'
import styled from 'styled-components'

import TrackPage from 'analytics/TrackPage'
import Box from 'components/base/Box'
import Text from 'components/base/Text'
import Button from 'components/base/Button'
import TranslatedError from 'components/TranslatedError'
import CheckCircle from 'icons/CheckCircle'
import ExclamationCircleThin from 'icons/ExclamationCircleThin'

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

function StepConfirmation({ t, error }: StepProps) {
  if (error) {
    return (
      <Container>
        <Box color="alertRed">
          <ExclamationCircleThin size={44} />
        </Box>
        <Box
          color="dark"
          mt={4}
          fontSize={5}
          ff="Museo Sans|Regular"
          textAlign="center"
          style={{ maxWidth: 350 }}
        >
          <TranslatedError error={error} field="title" />
        </Box>
        <Box
          color="graphite"
          mt={4}
          fontSize={4}
          ff="Open Sans"
          textAlign="center"
          style={{ maxWidth: 350 }}
        >
          <TranslatedError error={error} field="description" />
        </Box>
      </Container>
    )
  }

  return (
    <Container>
      <TrackPage category="Manager" name="FirmwareConfirmation" />
      <Box mx={7} color="positiveGreen" my={4}>
        <CheckCircle size={44} />
      </Box>
      <Title>{t('manager.modal.successTitle')}</Title>
      <Box mt={2} mb={5}>
        <Text ff="Open Sans|Regular" fontSize={4} color="graphite">
          {t('manager.modal.successText')}
        </Text>
      </Box>
      <Box mx={7} />
    </Container>
  )
}

export function StepConfirmFooter({ t, onCloseModal }: StepProps) {
  return (
    <Button primary onClick={onCloseModal}>
      {t('common.close')}
    </Button>
  )
}

export default StepConfirmation

// @flow
import React from 'react'
import styled from 'styled-components'

import Box from 'components/base/Box'

const DisclaimerBoxContainer = styled(Box).attrs({
  shrink: 1,
  grow: true,
  p: 3,
  borderRadius: '4px',
  bg: '#f9f9f980',
})`
  min-width: 620px;
  border: 1px dashed ${p => p.theme.colors.fog};
`
const DisclaimerBoxIconContainer = styled(Box).attrs({
  color: p => p.theme.colors.alertRed,
})``

const DisclaimerText = styled(Box).attrs({
  ff: 'Open Sans|Regular',
  shrink: 1,
  grow: true,
  fontSize: 3,
})`
  padding-left: 15px;
  max-width: 100%;
  color: ${p => p.theme.colors.smoke};
`

export default function DisclaimerBox({
  icon,
  content,
  ...p
}: {
  icon: React$Node,
  content: React$Node,
}) {
  return (
    <DisclaimerBoxContainer {...p}>
      <Box m={2} horizontal alignItems="center" justifyContent="center">
        <DisclaimerBoxIconContainer>{icon}</DisclaimerBoxIconContainer>
        <DisclaimerText>{content}</DisclaimerText>
      </Box>
    </DisclaimerBoxContainer>
  )
}

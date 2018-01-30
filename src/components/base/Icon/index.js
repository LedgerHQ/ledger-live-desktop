// @flow

import React from 'react'
import styled from 'styled-components'
import { fontSize, color } from 'styled-system'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'

const Container = styled.span`
  ${fontSize};
  ${color};
  position: relative;
`

export default ({ name, ...props }: { name: string }) => (
  <Container {...props}>
    <FontAwesomeIcon icon={name} />
  </Container>
)

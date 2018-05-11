// @flow
import styled from 'styled-components'

import Box from 'components/base/Box'

export const Title = styled(Box).attrs({
  width: 152,
  height: 27,
  ff: 'Museo Sans|Regular',
  fontSize: 7,
  color: 'dark',
})``

export const Description = styled(Box).attrs({
  width: 340,
  height: 36,
  ff: 'Open Sans|Regular',
  fontSize: 4,
  textAlign: 'center',
  color: 'smoke',
})`
  margin: 10px auto 25px;
`
export const Inner = styled(Box).attrs({
  horizontal: true,
  grow: true,
  flow: 4,
})``

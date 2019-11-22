// @flow
import React from 'react'
import styled from 'styled-components'

import Box from 'components/base/Box'

import DelegationIcon from 'icons/Delegation'
import UndelegationIcon from 'icons/Undelegation'

type Props = {
  left: React$Node,
  right: React$Node,
  undelegation?: boolean,
}

const Wrapper = styled(Box).attrs(() => ({
  horizontal: true,
}))`
  justify-content: space-between;
  align-items: flex-start;
`

const Container = styled(Box).attrs(() => ({
  mx: 2,
}))`
  align-self: center;
`

const DelegationContainer = ({ left, right, undelegation }: Props) => (
  <Wrapper>
    {left}
    <Container mx={2}>
      {undelegation ? <UndelegationIcon size={76} /> : <DelegationIcon size={76} />}
    </Container>
    {right}
  </Wrapper>
)

export default DelegationContainer

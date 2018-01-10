// @flow

import React from 'react'
import type { Element } from 'react'
import styled from 'styled-components'

import Box from 'components/base/Box'
import Text from 'components/base/Text'

type Props = {
  children: string,
  desc?: string | null,
  icon?: Element<*> | null,
}

const Container = styled(Box).attrs({
  horizontal: true,
  align: 'center',
  color: 'lead',
  p: 2,
})`
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`

const IconWrapper = styled(Box)`
  width: 30px;
  height: 30px;
  border: 2px solid rgba(255, 255, 255, 0.1);
`

export default function Item({ children, desc, icon }: Props) {
  return (
    <Container>
      <IconWrapper mr={2}>{icon || null}</IconWrapper>
      <div>
        <Text fontWeight="bold" fontSize={1}>
          {children}
        </Text>
        {desc && (
          <Box color="steel" fontSize={0}>
            {desc}
          </Box>
        )}
      </div>
    </Container>
  )
}

Item.defaultProps = {
  icon: null,
  desc: null,
}

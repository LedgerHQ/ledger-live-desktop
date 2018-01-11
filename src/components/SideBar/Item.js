// @flow

import React from 'react'
import styled from 'styled-components'
import { compose } from 'redux'
import { withRouter } from 'react-router'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'

import type { Element } from 'react'
import type { Location } from 'react-router'

import Box from 'components/base/Box'
import Text from 'components/base/Text'

type Props = {
  children: string,
  linkTo?: string | null,
  desc?: string | null,
  icon?: Element<*> | null,
  location: Location,
  push: Function,
}

const mapDispatchToProps = {
  push,
}

const Container = styled(Box).attrs({
  horizontal: true,
  align: 'center',
  color: 'lead',
  p: 2,
})`
  cursor: pointer;
  color: ${p => (p.active ? p.theme.colors.white : '')};

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`

const IconWrapper = styled(Box)`
  width: 30px;
  height: 30px;
  border: 2px solid rgba(255, 255, 255, 0.1);
`

function Item({ children, desc, icon, linkTo, push, location }: Props) {
  const { pathname } = location
  return (
    <Container onClick={linkTo ? () => push(linkTo) : void 0} active={pathname === linkTo}>
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
  linkTo: null,
}

export default compose(
  withRouter,
  // connect router here only to make components re-render
  // see https://github.com/ReactTraining/react-router/issues/4671
  connect(({ router }) => ({ router }), mapDispatchToProps, null, {
    pure: false,
  }),
)(Item)

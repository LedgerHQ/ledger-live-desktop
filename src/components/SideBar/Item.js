// @flow

import React from 'react'
import styled from 'styled-components'
import { compose } from 'redux'
import { withRouter } from 'react-router'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'

import { openModal } from 'reducers/modals'

import type { Node } from 'react'
import type { MapStateToProps } from 'react-redux'
import type { Location } from 'react-router'

import Box, { Tabbable } from 'components/base/Box'
import Text from 'components/base/Text'

const mapStateToProps: MapStateToProps<*, *, *> = (state: any) => ({
  // connect router here only to make components re-render
  // see https://github.com/ReactTraining/react-router/issues/4671
  router: state.router,
})

const mapDispatchToProps = {
  push,
  openModal,
}

const Container = styled(Tabbable).attrs({
  alignItems: 'center',
  borderRadius: 1,
  ff: 'Open Sans|SemiBold',
  flow: 3,
  horizontal: true,
  px: 3,
})`
  cursor: pointer;
  color: ${p => p.theme.colors.dark};
  opacity: ${p => (p.isActive ? 1 : 0.4)};
  background: ${p => (p.isActive ? p.theme.colors.argile : '')};
  height: ${p => (p.big ? 50 : 36)}px;
  outline: none;

  &:hover {
    background: ${p => (p.isActive ? p.theme.colors.argile : p.theme.colors.cream)};
  }
`

type Props = {
  iconActiveColor?: string,
  children: string,
  linkTo?: string | null,
  modal?: string | null,
  desc?: string | null,
  icon?: Node | null,
  big?: boolean,
  location: Location,
  push: Function,
  openModal: Function,
}

function Item({
  big,
  iconActiveColor,
  children,
  desc,
  icon,
  linkTo,
  push,
  location,
  modal,
  openModal,
}: Props) {
  const { pathname } = location
  const isActive = pathname === linkTo
  return (
    <Container
      big={big}
      onClick={
        linkTo
          ? isActive ? undefined : () => push(linkTo)
          : modal ? () => openModal(modal) : void 0
      }
      isActive={isActive}
    >
      {icon && <Box color={isActive ? iconActiveColor : void 0}>{icon}</Box>}
      <Box justifyContent="center">
        <Text fontSize={4}>{children}</Text>
        {desc && (
          <Box color="steel" fontSize={3}>
            {desc}
          </Box>
        )}
      </Box>
    </Container>
  )
}

Item.defaultProps = {
  iconActiveColor: 'blue',
  big: false,
  desc: null,
  icon: null,
  linkTo: null,
  modal: null,
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps, null, {
    pure: false,
  }),
)(Item)

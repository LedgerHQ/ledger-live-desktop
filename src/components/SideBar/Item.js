// @flow

import React from 'react'
import styled from 'styled-components'
import { compose } from 'redux'
import { withRouter } from 'react-router'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'

import { openModal, isModalOpened } from 'reducers/modals'

import type { MapStateToProps } from 'react-redux'
import type { Element } from 'react'
import type { Location } from 'react-router'

import Box from 'components/base/Box'
import Text from 'components/base/Text'

const mapStateToProps: MapStateToProps<*, *, *> = (state, { modal }: any) => ({
  // connect router here only to make components re-render
  // see https://github.com/ReactTraining/react-router/issues/4671
  router: state.router,
  isModalOpened: modal ? isModalOpened(state, modal) : false,
})

const mapDispatchToProps = {
  push,
  openModal,
}

const Container = styled(Box).attrs({
  horizontal: true,
  align: 'center',
  color: 'lead',
  p: 2,
})`
  cursor: pointer;
  color: ${p => (p.isActive ? p.theme.colors.white : '')};
  background: ${p => (p.isActive ? 'rgba(255, 255, 255, 0.05)' : '')};
  box-shadow: ${p =>
    p.isActive ? `${p.theme.colors.blue} 4px 0 0 inset` : `${p.theme.colors.blue} 0 0 0 inset`};
  transition: ease-in-out 100ms box-shadow;

  &:hover {
    background: rgba(255, 255, 255, 0.05);
  }
`

const IconWrapper = styled(Box)`
  width: 25px;
  height: 25px;
  border: 2px solid ${p => (p.isActive ? p.theme.colors.blue : 'rgba(255, 255, 255, 0.1)')};
`

type Props = {
  children: string,
  linkTo?: string | null,
  modal?: string | null,
  desc?: string | null,
  icon?: Element<*> | null,
  location: Location,
  isModalOpened: boolean,
  push: Function,
  openModal: Function,
}

function Item({
  children,
  desc,
  icon,
  linkTo,
  push,
  location,
  modal,
  openModal,
  isModalOpened,
}: Props) {
  const { pathname } = location
  const isActive = pathname === linkTo || isModalOpened
  return (
    <Container
      onClick={
        linkTo
          ? isActive ? undefined : () => push(linkTo)
          : modal ? () => openModal(modal) : void 0
      }
      isActive={isActive}
    >
      <IconWrapper isActive={isActive} mr={2}>
        {icon || null}
      </IconWrapper>
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
  modal: null,
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps, null, {
    pure: false,
  }),
)(Item)

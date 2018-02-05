// @flow

import React from 'react'
import styled from 'styled-components'
import { compose } from 'redux'
import { withRouter } from 'react-router'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'

import { openModal } from 'reducers/modals'

import type { MapStateToProps } from 'react-redux'
import type { Location } from 'react-router'

import Box, { Tabbable } from 'components/base/Box'
import Text from 'components/base/Text'
import Icon from 'components/base/Icon'

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
  horizontal: true,
  align: 'center',
  px: 2,
  py: 1,
  flow: 2,
})`
  border-radius: 5px;
  cursor: pointer;
  color: ${p => (p.isActive ? p.theme.colors.shark : p.theme.colors.grey)};
  background: ${p => (p.isActive ? p.theme.colors.argile : '')};
  outline: none;
  &:hover,
  &:focus {
    background: ${p => (p.isActive ? p.theme.colors.argile : p.theme.colors.cream)};
  }
`

type Props = {
  children: string,
  linkTo?: string | null,
  modal?: string | null,
  desc?: string | null,
  icon?: string | null,
  location: Location,
  push: Function,
  openModal: Function,
}

function Item({ children, desc, icon, linkTo, push, location, modal, openModal }: Props) {
  const { pathname } = location
  const isActive = pathname === linkTo
  return (
    <Container
      onClick={
        linkTo
          ? isActive ? undefined : () => push(linkTo)
          : modal ? () => openModal(modal) : void 0
      }
      isActive={isActive}
    >
      {icon && <Icon fontSize={2} color={isActive ? 'blue' : void 0} name={icon} />}
      <div>
        <Text fontSize={1} fontWeight="bold">
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

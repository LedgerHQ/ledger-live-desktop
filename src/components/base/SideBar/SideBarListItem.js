// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'

import Box, { Tabbable } from 'components/base/Box'
import { rgba } from 'styles/helpers'

export type Item = {
  label: string | (Props => React$Element<any>),
  desc?: Props => any, // TODO: type should be more precise, but, eh ¯\_(ツ)_/¯
  icon?: any, // TODO: type should be more precise, but, eh ¯\_(ツ)_/¯
  iconActiveColor: ?string,
  hasNotif?: boolean,
  isActive?: boolean,
  onClick?: void => void,
}

export type Props = {
  label: string | (Props => React$Element<any>),
  desc?: Props => any, // TODO: type should be more precise, but, eh ¯\_(ツ)_/¯
  icon?: any, // TODO: type should be more precise, but, eh ¯\_(ツ)_/¯
  iconActiveColor: ?string,
  hasNotif?: boolean,
  isActive?: boolean,
  onClick?: void => void,
  isActive?: boolean,
}

class SideBarListItem extends PureComponent<Props> {
  render() {
    const { icon: Icon, label, desc, iconActiveColor, hasNotif, onClick, isActive } = this.props
    return (
      <Container
        data-role="side-bar-item"
        isActive={isActive}
        iconActiveColor={iconActiveColor}
        onClick={onClick}
      >
        {!!Icon && <Icon size={16} />}
        <Box grow shrink>
          {typeof label === 'function' ? (
            label(this.props)
          ) : (
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {label}
            </span>
          )}
          {!!desc && desc(this.props)}
        </Box>
        {!!hasNotif && <Bullet />}
      </Container>
    )
  }
}

const Container = styled(Tabbable).attrs({
  align: 'center',
  borderRadius: 1,
  ff: 'Open Sans|SemiBold',
  flow: 3,
  horizontal: true,
  px: 3,
  py: 2,
})`
  cursor: ${p => (p.isActive ? 'default' : 'pointer')};
  color: ${p => (p.isActive ? p.theme.colors.dark : p.theme.colors.smoke)};
  background: ${p => (p.isActive ? p.theme.colors.lightGrey : '')};

  &:active {
    background: ${p => p.theme.colors.lightGrey};
  }

  &:hover {
    color: ${p => p.theme.colors.dark};
  }

  border: 1px solid transparent;
  &:focus {
    outline: none;
    border-color: ${p => rgba(p.theme.colors.wallet, 0.3)};
  }

  ${p => {
    const iconActiveColor = p.theme.colors[p.iconActiveColor] || p.iconActiveColor
    return `
      svg { color: ${p.isActive ? iconActiveColor : p.theme.colors.grey}; }
      &:hover svg { color: ${iconActiveColor}; }
    `
  }};
`

const Bullet = styled.div`
  background: ${p => p.theme.colors.wallet};
  width: 8px;
  height: 8px;
  border-radius: 100%;
`

export default SideBarListItem

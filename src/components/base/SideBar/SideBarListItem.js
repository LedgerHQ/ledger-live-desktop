// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'

import Box, { Tabbable } from 'components/base/Box'

export type Props = {
  label: string | (Props => React$Node),
  desc?: Props => any, // TODO: type should be more precise, but, eh ¯\_(ツ)_/¯
  icon?: any, // TODO: type should be more precise, but, eh ¯\_(ツ)_/¯
  disabled?: boolean,
  iconActiveColor: ?string,
  hasNotif?: boolean,
  isActive?: boolean,
  onClick?: void => void,
  isActive?: boolean,
}

class SideBarListItem extends PureComponent<Props> {
  render() {
    const {
      icon: Icon,
      label,
      desc,
      iconActiveColor,
      hasNotif,
      onClick,
      isActive,
      disabled,
    } = this.props
    return (
      <Container
        isActive={!disabled && isActive}
        iconActiveColor={iconActiveColor}
        onClick={disabled ? undefined : onClick}
        disabled={disabled}
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
  cursor: ${p => (p.disabled ? 'not-allowed' : 'default')};
  color: ${p => (p.isActive ? p.theme.colors.dark : p.theme.colors.smoke)};
  background: ${p => (p.isActive ? p.theme.colors.lightGrey : '')};
  opacity: ${p => (p.disabled ? 0.5 : 1)};

  &:active {
    background: ${p => !p.disabled && p.theme.colors.lightGrey};
  }

  &:hover {
    color: ${p => !p.disabled && p.theme.colors.dark};
  }

  ${p => {
    const iconActiveColor = p.theme.colors[p.iconActiveColor] || p.iconActiveColor
    const color = p.isActive ? iconActiveColor : p.theme.colors.grey
    return `
      svg { color: ${color}; }
      &:hover svg { color: ${p.disabled ? color : iconActiveColor}; }
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

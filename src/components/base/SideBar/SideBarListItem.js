// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'

import { Hide } from 'components/MainSideBar'
import Box, { Tabbable } from 'components/base/Box'
import Tooltip from 'components/base/Tooltip'

export type Props = {
  label: string | (Props => React$Node),
  desc?: Props => any, // TODO: type should be more precise, but, eh ¯\_(ツ)_/¯
  icon?: any, // TODO: type should be more precise, but, eh ¯\_(ツ)_/¯
  disabled?: boolean,
  iconActiveColor: ?string,
  NotifComponent?: React$ComponentType<*>,
  isActive?: boolean,
  onClick?: void => void,
  isActive?: boolean,
  collapsed?: boolean,
}

class SideBarListItem extends PureComponent<Props> {
  render() {
    const {
      icon: Icon,
      label,
      desc,
      iconActiveColor,
      NotifComponent,
      onClick,
      isActive,
      disabled,
      collapsed,
    } = this.props

    const renderedLabel =
      typeof label === 'function' ? (
        label(this.props)
      ) : (
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {label}
        </span>
      )

    return (
      <Tooltip content={renderedLabel} enabled={!!collapsed} boundary="window" placement="right">
        <Container
          isActive={!disabled && isActive}
          iconActiveColor={iconActiveColor}
          onClick={disabled ? undefined : onClick}
          disabled={disabled}
        >
          {!!Icon && <Icon size={16} />}
          <Box grow shrink data-e2e={`sidebarItem_${String(label)}`}>
            <Hide visible={!collapsed}>
              {renderedLabel}
              {!!desc && desc(this.props)}
            </Hide>
          </Box>
          {NotifComponent && <NotifComponent />}
        </Container>
      </Tooltip>
    )
  }
}

const Container = styled(Tabbable).attrs(() => ({
  align: 'center',
  borderRadius: 1,
  ff: 'Inter|SemiBold',
  flow: 3,
  horizontal: true,
  px: 3,
  py: 2,
}))`
  width: 100%;
  cursor: ${p => (p.disabled ? 'not-allowed' : 'pointer')};
  color: ${p =>
    p.isActive ? p.theme.colors.palette.text.shade100 : p.theme.colors.palette.text.shade80};
  background: ${p => (p.isActive ? p.theme.colors.palette.action.hover : '')};
  opacity: ${p => (p.disabled ? 0.5 : 1)};

  &:active {
    background: ${p => !p.disabled && p.theme.colors.palette.action.hover};
  }

  &:hover {
    color: ${p => !p.disabled && p.theme.colors.palette.text.shade100};
  }

  ${p => {
    const iconActiveColor = p.theme.colors[p.iconActiveColor] || p.iconActiveColor
    const color = p.isActive ? iconActiveColor : p.theme.colors.palette.text.shade60
    return `
      svg { color: ${color}; }
      &:hover svg { color: ${p.disabled ? color : iconActiveColor}; }
    `
  }};
`

export default SideBarListItem

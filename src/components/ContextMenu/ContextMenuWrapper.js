// @flow

import React, { PureComponent } from 'react'
import { Trans } from 'react-i18next'
import styled from 'styled-components'
import Box from 'components/base/Box'

// $FlowFixMe
export const ContextMenuContext = React.createContext({})

export const withContextMenuContext = (ComponentToDecorate: React$ComponentType<*>) => (
  props: *,
) => (
  <ContextMenuContext.Consumer>
    {context => <ComponentToDecorate {...props} context={context} />}
  </ContextMenuContext.Consumer>
)

export type ContextMenuItemType = {
  label: string,
  Icon?: React$ComponentType<any>,
  callback: any => any,
  dontTranslateLabel?: boolean,
}

type Props = {
  children: React$Node,
}
type State = {
  visible: boolean,
  items: ContextMenuItemType[],
  x: number,
  y: number,
}

const ContextMenuOverlay = styled(Box)`
  z-index: 30;
  width: 100%;
  height: 100%;
  position: absolute;
`

const ContextMenuContainer = styled(Box)`
  position: absolute;
  top: ${p => p.y}px;
  left: ${p => p.x}px;
  width: auto;
  border-radius: 4px;
  box-shadow: 0 4px 8px 0 #00000007;
  border: 1px solid ${p => p.theme.colors.palette.divider};
  background-color: ${p => p.theme.colors.palette.background.paper};
  padding: 10px;
`

const ContextMenuItemContainer = styled(Box).attrs(() => ({
  ff: 'Inter',
}))`
  padding: 8px 16px;
  text-align: center;
  flex-direction: row;
  align-items: left;
  border-radius: 4px;
  color: ${p => p.theme.colors.palette.text.shade100};
  font-size: 12px;
  font-weight: 500;

  &:hover {
    cursor: pointer;
    background: ${p => p.theme.colors.palette.background.default};
  }
`

class ContextMenuWrapper extends PureComponent<Props, State> {
  state = {
    visible: false,
    items: [],
    x: 0,
    y: 0,
  }

  showContextMenu = (event: MouseEvent, items: ContextMenuItemType[]) => {
    const { clientX: x, clientY: y } = event
    const { innerHeight: wy, innerWidth: wx } = window

    const xOffset = wx - x < 170 ? -170 : 0 // FIXME do this dynamically?
    const yOffset = wy < y + items.length * 30 ? -items.length * 30 : 0
    this.setState({ visible: true, items, x: x + xOffset, y: y + yOffset })
  }

  hideContextMenu = () => {
    this.setState({ visible: false, items: [] })
  }

  renderItem = (item: ContextMenuItemType, index: number) => {
    const { dontTranslateLabel, callback, label, Icon } = item

    return (
      <ContextMenuItemContainer key={index} onClick={callback}>
        {Icon && (
          <Box pr={2} color="palette.text.shade60">
            <Icon size={16} />
          </Box>
        )}
        {(dontTranslateLabel && label) || <Trans i18nKey={label} />}
      </ContextMenuItemContainer>
    )
  }

  render() {
    const { x, y, items } = this.state
    const { children } = this.props
    return (
      <ContextMenuContext.Provider value={{ showContextMenu: this.showContextMenu }}>
        {children}
        {this.state.visible && (
          <ContextMenuOverlay onClick={this.hideContextMenu}>
            <ContextMenuContainer x={x} y={y}>
              {items.map(this.renderItem)}
            </ContextMenuContainer>
          </ContextMenuOverlay>
        )}
      </ContextMenuContext.Provider>
    )
  }
}

export default ContextMenuWrapper

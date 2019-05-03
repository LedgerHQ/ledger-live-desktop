// @flow

import React, { PureComponent } from 'react'
import { Trans } from 'react-i18next'
import styled from 'styled-components'
import Box from 'components/base/Box'
import { colors } from 'styles/theme'

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
  width: 170px;
  border-radius: 4px;
  box-shadow: 0 4px 8px 0 #00000007;
  border: 1px solid #d8d8d8;
  background-color: white;
  padding: 10px;
`

const ContextMenuItemContainer = styled(Box)`
  padding: 10px 10px;
  text-align: center;
  flex-direction: row;
  align-items: left;
  border-radius: 4px;
  color: ${p => p.theme.colors.smoke};
  font-family: 'Open Sans', Arial;
  font-size: 13px;

  &:hover {
    cursor: pointer;
    color: ${p => p.theme.colors.dark};
    background: ${p => p.theme.colors.lightGrey};
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
          <Box pr={2} color={colors.grey}>
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

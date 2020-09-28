// @flow

import React, { PureComponent } from "react";
import { Trans } from "react-i18next";
import styled from "styled-components";
import Box from "~/renderer/components/Box";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

// $FlowFixMe
export const ContextMenuContext = React.createContext({});

export const withContextMenuContext = (ComponentToDecorate: React$ComponentType<*>) => {
  const WrappedContextMenu = (props: *) => (
    <ContextMenuContext.Consumer>
      {context => <ComponentToDecorate {...props} context={context} />}
    </ContextMenuContext.Consumer>
  );
  return WrappedContextMenu;
};

export type ContextMenuItemType = {
  label: string,
  Icon?: React$ComponentType<any>,
  callback: any => any,
  dontTranslateLabel?: boolean,
};

type Props = {
  children: React$Node,
};
type State = {
  visible: boolean,
  items: ContextMenuItemType[],
  x: number,
  y: number,
};

const ContextMenuContainer: ThemedComponent<{ x: number, y: number }> = styled(Box)`
  position: absolute;
  top: ${p => p.y}px;
  left: ${p => p.x}px;
  width: auto;
  border-radius: 4px;
  box-shadow: 0 4px 8px 0 #00000007;
  border: 1px solid ${p => p.theme.colors.palette.divider};
  background-color: ${p => p.theme.colors.palette.background.paper};
  padding: 10px;
`;

const ContextMenuItemContainer: ThemedComponent<{}> = styled(Box).attrs(() => ({
  ff: "Inter",
}))`
  padding: 8px 16px;
  text-align: center;
  flex-direction: row;
  align-items: flex-start;
  border-radius: 4px;
  color: ${p => p.theme.colors.palette.text.shade100};
  font-size: 12px;
  font-weight: 500;

  &:hover {
    cursor: pointer;
    background: ${p => p.theme.colors.palette.background.default};
  }
`;

class ContextMenuWrapper extends PureComponent<Props, State> {
  state = {
    visible: false,
    items: [],
    x: 0,
    y: 0,
  };

  containerRef: *;

  componentWillUnmount() {
    window.removeEventListener("click", this.hideContextMenu, true);
  }

  showContextMenu = (event: MouseEvent, items: ContextMenuItemType[]) => {
    const { clientX: x, clientY: y } = event;
    const { innerHeight: wy, innerWidth: wx } = window;

    const xOffset = wx - x < 170 ? -170 : 0; // FIXME do this dynamically?
    const yOffset = wy < y + items.length * 30 ? -items.length * 30 : 0;
    this.setState({ visible: true, items, x: x + xOffset, y: y + yOffset });
    window.addEventListener("click", this.hideContextMenu, true);
  };

  hideContextMenu = (evt?: PointerEvent) => {
    // NB Allow opening the context menu on a different target if already open.
    if (evt?.srcElement?.parentElement === this.containerRef) {
      return;
    }

    this.setState({ visible: false, items: [] });
    window.removeEventListener("click", this.hideContextMenu, true);
  };

  setContainerRef = (ref: *) => (this.containerRef = ref);

  renderItem = (item: ContextMenuItemType, index: number) => {
    const { dontTranslateLabel, callback, label, Icon } = item;

    return (
      <ContextMenuItemContainer
        key={index}
        onClick={e => {
          callback(e);
          this.hideContextMenu();
        }}
      >
        {Icon && (
          <Box pr={2} color="palette.text.shade60">
            <Icon size={16} />
          </Box>
        )}
        {(dontTranslateLabel && label) || <Trans i18nKey={label} />}
      </ContextMenuItemContainer>
    );
  };

  render() {
    const { x, y, items } = this.state;
    const { children } = this.props;
    return (
      <ContextMenuContext.Provider value={{ showContextMenu: this.showContextMenu }}>
        {children}
        {this.state.visible && (
          <ContextMenuContainer ref={this.setContainerRef} x={x} y={y}>
            {items.map(this.renderItem)}
          </ContextMenuContainer>
        )}
      </ContextMenuContext.Provider>
    );
  }
}

export default ContextMenuWrapper;

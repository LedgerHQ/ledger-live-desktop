import React, { PureComponent } from "react";
import { Trans } from "react-i18next";
import { Flex, Text } from "@ledgerhq/react-ui";
import Box from "~/renderer/components/Box";
import styled from "styled-components";
import { ThemedComponent } from "~/renderer/styles/StyleProvider";

export const ContextMenuContext = React.createContext({});

export const withContextMenuContext = (ComponentToDecorate: React.ComponentType<any>) => {
  const WrappedContextMenu = (props: any) => (
    <ContextMenuContext.Consumer>
      {context => <ComponentToDecorate {...props} context={context} />}
    </ContextMenuContext.Consumer>
  );
  return WrappedContextMenu;
};

export type ContextMenuItemType = {
  label: string;
  Icon?: React.ReactComponentType<any>;
  callback: () => any;
  dontTranslateLabel?: boolean;
  id?: string;
} | "separator";

type Props = {
  children: React.ReactNode;
};
type State = {
  visible: boolean;
  items: ContextMenuItemType[];
  x: number;
  y: number;
};

const ContextMenuContainer: ThemedComponent<{ x: number; y: number }> = styled(Flex).attrs(() => ({
  padding: 3,
  backgroundColor: "palette.neutral.c00",
  flexDirection: "column",
  rowGap: 2,
}))`
  position: absolute;
  top: ${p => p.y}px;
  left: ${p => p.x}px;
  border-radius: 8px;
  width: auto;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid ${p => p.theme.colors.palette.neutral.c40};
`;

const ContextMenuItemContainer: ThemedComponent<{}> = styled(Flex).attrs(() => ({
}))`
  height: 40px;
  padding: 0px 16px;
  text-align: center;
  flex-direction: row;
  align-items: center;
  border-radius: 4px;
  color: ${p => p.theme.colors.palette.neutral.c80};

  & > * {
    pointer-events: none;
  }
  &:hover {
    cursor: pointer;
    background: ${p => p.theme.colors.palette.neutral.c30};
  }
`;

const Separator: ThemedComponent<{}> = styled(Flex).attrs(() => ({
  height: "1px",
  width: "100%",
  backgroundColor: "palette.neutral.c40",
}))``

class ContextMenuWrapper extends PureComponent<Props, State> {
  state = {
    visible: false,
    items: [],
    x: 0,
    y: 0,
  };

  containerRef: React.RefObject<HTMLInputElement>;

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

  setContainerRef = (ref: React.RefObject<HTMLInputElement>) => (this.containerRef = ref);

  renderItem = (item: ContextMenuItemType, index: number) => {
    if (item === "separator") return <Separator />;
    const { dontTranslateLabel, callback, label, Icon, id } = item;

    return (
      <ContextMenuItemContainer
        key={index}
        onClick={e => {
          callback(e);
          this.hideContextMenu();
        }}
        id={id}
      >
        {Icon && (
          <Box pr={3}>
            <Icon size={16} color="palette.neutral.c80" />
          </Box>
        )}
        <Text variant="small" fontWeight="semiBold" color="palette.neutral.c80">
          {(dontTranslateLabel && label) || <Trans i18nKey={label} />}
        </Text>
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

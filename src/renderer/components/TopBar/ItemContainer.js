// @flow

import styled from "styled-components";

import { rgba } from "~/renderer/styles/helpers";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import { Tabbable } from "~/renderer/components/Box";

const ItemContainer: ThemedComponent<{
  "data-e2e"?: string,
  isInteractive?: boolean,
  onClick?: () => void,
  disabled?: boolean,
  children: React$Node,
  justifyContent?: string,
}> = styled(Tabbable).attrs(p => ({
  px: 3,
  ml: 0,
  alignItems: "center",
  cursor: p.disabled ? "not-allowed" : "default",
  horizontal: true,
  borderRadius: 1,
}))`
  -webkit-app-region: no-drag;
  height: 40px;
  position: relative;
  pointer-events: ${p => (p.disabled ? "none" : "unset")};

  &:hover {
    color: ${p => (p.disabled ? "" : p.theme.colors.palette.text.shade100)};
    background: ${p => (p.disabled ? "" : rgba(p.theme.colors.palette.action.active, 0.05))};
  }

  &:active {
    background: ${p => (p.disabled ? "" : rgba(p.theme.colors.palette.action.active, 0.1))};
  }
`;

export default ItemContainer;

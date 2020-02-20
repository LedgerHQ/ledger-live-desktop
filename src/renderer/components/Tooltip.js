// @flow

import React from "react";
import Tippy from "@tippy.js/react";
import styled from "styled-components";
import get from "lodash/get";
import { followCursor as followCursorPlugin } from "tippy.js";

import "tippy.js/dist/tippy.css";
import "tippy.js/animations/shift-toward.css";
import "tippy.js/dist/svg-arrow.css";

import useTheme from "~/renderer/hooks/useTheme";

const ContentContainer = styled.div.attrs(p => ({
  style: {
    background: p.bg,
    color: p.theme.colors.palette.background.paper,
  },
}))`
  font-family: Inter, sans-serif;
  font-weight: 600;
  font-size: 10px;
  text-align: center;
  padding: 5px 9px;
  border-radius: 4px;
  word-wrap: break-word;
`;

const ChildrenContainer = styled.div`
  display: inline-flex;
  flex-shrink: 1;
  max-width: 100%;
`;

export const defaultTippyOptions = {
  animation: "shift-toward",
  offset: 0,
  theme: "ledger",
  plugins: [followCursorPlugin],
};

const Arrow = bg =>
  `<svg viewBox="0 0 24 8"><path fill=${bg} d="M5 8l5.5-5.6c.8-.8 2-.8 2.8 0L19 8" /></svg>`;

type Props = {
  tooltipBg?: string,
  children?: React$Node,
  content: React$Node,
  delay?: number,
  followCursor?: boolean,
  enabled?: boolean,
  placement?: string,
  arrow?: boolean,
  flip?: boolean,
  hideOnClick?: boolean,
};

const ToolTip = ({
  followCursor,
  tooltipBg,
  children,
  content,
  delay,
  enabled,
  placement = "top",
  arrow = true,
  flip = true,
  hideOnClick = true,
}: Props) => {
  const colors = useTheme("colors");

  const bg = tooltipBg ? get(colors, tooltipBg, tooltipBg) : colors.palette.text.shade100;

  return (
    <Tippy
      {...defaultTippyOptions}
      content={<ContentContainer bg={bg}>{content}</ContentContainer>}
      delay={[delay, 0]}
      arrow={content && arrow ? Arrow(bg) : null}
      followCursor={followCursor}
      enabled={!!content && enabled}
      placement={placement}
      flip={flip}
      hideOnClick={hideOnClick}
    >
      <ChildrenContainer>{children}</ChildrenContainer>
    </Tippy>
  );
};

export default ToolTip;

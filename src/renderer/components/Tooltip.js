// @flow

import React from "react";
import Tippy from "@tippyjs/react";

import styled from "styled-components";
import get from "lodash/get";
import { followCursor as followCursorPlugin, roundArrow } from "tippy.js";

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

// FIXME this is annoying wrapper!
const ChildrenContainer = styled.div`
  display: inline-flex;
  flex-shrink: 1;
  max-width: 100%;
`;

export const defaultTippyOptions = {
  animation: "shift-toward",
  theme: "ledger",
  plugins: [followCursorPlugin],
};

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
  disableWrapper?: boolean,
  containerStyle?: *,
};

const ToolTip = ({
  followCursor,
  tooltipBg,
  children,
  content,
  delay,
  enabled = true,
  disableWrapper = false,
  placement = "top",
  arrow = true,
  flip = true,
  hideOnClick = true,
  containerStyle,
}: Props) => {
  const colors = useTheme("colors");

  const bg = tooltipBg ? get(colors, tooltipBg, tooltipBg) : colors.palette.text.shade100;

  return (
    <Tippy
      {...defaultTippyOptions}
      content={<ContentContainer bg={bg}>{content}</ContentContainer>}
      delay={[delay, 0]}
      arrow={arrow ? roundArrow : false}
      followCursor={followCursor}
      disabled={!(!!content && enabled)}
      placement={placement}
      flip={flip}
      hideOnClick={hideOnClick}
      className={`bg-${tooltipBg || "default"}`}
    >
      {disableWrapper ? (
        children
      ) : (
        <ChildrenContainer style={containerStyle}>{children}</ChildrenContainer>
      )}
    </Tippy>
  );
};

export default ToolTip;

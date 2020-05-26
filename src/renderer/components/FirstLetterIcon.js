// @flow
import styled from "styled-components";
import { color, margin } from "styled-system";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const FirstLetterIcon: ThemedComponent<{ label: string }> = styled.div.attrs(p => ({
  content: p.label ? p.label.substring(0, 2) : "",
  bg: p.theme.colors.palette.divider,
}))`
  display: flex;
  align-content: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  font-size: 13px;
  line-height: 24px;
  text-align: center;
  writing-mode: vertical-lr;
  text-orientation: upright;
  ${color};
  ${margin};
  color: ${p => p.theme.colors.palette.text.shade80};
  overflow: hidden;
  &::after {
    content: "${p => p.content}";
    text-align: center;
    letter-spacing: 24px;
    display: inline-block;
    text-transform: uppercase;
    height: 16px;
  }
`;

export default FirstLetterIcon;

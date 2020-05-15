// @flow
import styled from "styled-components";
import { color, margin } from "styled-system";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const FirstLetterIcon: ThemedComponent<{ label: string }> = styled.div.attrs(p => ({
  content: p.label ? p.label.charAt(0) : "",
  bg: p.theme.colors.palette.divider,
}))`
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
  font-size: 13px;
  line-height: 24px;
  text-align: center;
  ${color};
  ${margin};
  color: ${p => p.theme.colors.palette.text.shade80};
  &::after {
    content: "${p => p.content}";
  }
`;

export default FirstLetterIcon;

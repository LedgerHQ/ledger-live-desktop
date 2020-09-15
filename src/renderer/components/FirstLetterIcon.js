// @flow
import styled from "styled-components";
import { color, margin } from "styled-system";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const isEmoji = label =>
  /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/.test(
    label.substring(0, 2),
  );

const FirstLetterIcon: ThemedComponent<{ label: string }> = styled.div.attrs(p => ({
  content: p.label ? p.label.substring(0, isEmoji(p.label) ? 2 : 1) : "",
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
  color: ${p => p.theme.colors.palette.text.shade80};
  ${color};
  ${margin};
  overflow: hidden;
  &::after {
    content: "${p => p.content}";
    text-align: center;
    display: inline-block;
    text-transform: uppercase;
    height: 16px;
  }
`;

export default FirstLetterIcon;

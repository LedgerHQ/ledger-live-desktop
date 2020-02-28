// @flow

import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

export const PlaceholderLine: ThemedComponent<{
  dark?: boolean,
  width: number,
  height?: number,
}> = styled.div`
  background-color: ${p =>
    p.dark ? p.theme.colors.palette.text.shade80 : p.theme.colors.palette.text.shade20};
  width: ${p => p.width}px;
  height: ${p => p.height || 10}px;
  border-radius: 5px;
  margin: 5px 0;
`;

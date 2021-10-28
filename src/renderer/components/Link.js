// @flow
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { space, lineHeight, fontSize, fontWeight, color } from "styled-system";

export const FakeLink: ThemedComponent<{}> = styled.span`
  text-decoration: underline;
  cursor: pointer;
  color: ${p => p.color || p.theme.colors.wallet};
`;

const Link: ThemedComponent<*> = styled.a`
  ${color};
  ${fontSize};
  ${fontWeight};
  ${space};
  ${lineHeight}
  cursor: pointer;
  color: currentColor;
  text-decoration-skip: ink;
`;

export default Link;

// @flow
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

export const FakeLink: ThemedComponent<{}> = styled.span`
  text-decoration: underline;
  cursor: pointer;
  color: ${p => p.color || p.theme.colors.wallet};
`;

const Link: ThemedComponent<{}> = styled.a`
  cursor: pointer;
  text-decoration-skip: ink;
`;

export default Link;

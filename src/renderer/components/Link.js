// @flow
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

export const FakeLink: ThemedComponent<{}> = styled.span.attrs(() => ({
  color: "wallet",
}))`
  text-decoration: underline;
  cursor: pointer;
`;

const Link: ThemedComponent<{}> = styled.a`
  cursor: pointer;
  text-decoration-skip: ink;
`;

export default Link;

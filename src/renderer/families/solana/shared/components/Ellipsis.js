//@flow
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

export const Ellipsis: ThemedComponent<{}> = styled.div`
  flex: 1;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

// @flow
import { flexbox } from "styled-system";
import styled from "styled-components";
import type { ThemedComponent } from "@ui/styles/StyleProvider";

const FlexBox: ThemedComponent<{}> = styled.div`
  display: flex;
  ${flexbox};
`;

export default FlexBox;

import { flexbox, FlexboxProps } from "styled-system";
import styled from "styled-components";

const FlexBox = styled.div<FlexboxProps>`
  display: flex;
  column-gap: 15px;
  ${flexbox};
`;
export default FlexBox;

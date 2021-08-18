import { flexbox, FlexboxProps } from "styled-system";
import styled from "styled-components";

const FlexBox = styled.div<FlexboxProps>`
  display: flex;
  ${flexbox};
`;
export default FlexBox;

import { flexbox, FlexboxProps, compose } from "styled-system";
import styled from "styled-components";
import gapsSystem from "@ui/styles/system/gaps";

const FlexBox = styled.div<FlexboxProps>`
  display: flex;
  ${flexbox};
  ${compose(gapsSystem, flexbox)}
`;

export default FlexBox;

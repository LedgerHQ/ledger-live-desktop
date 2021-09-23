import { flexbox, SpaceProps, FlexboxProps, compose } from "styled-system";
import styled from "styled-components";
import gapsSystem from "@ui/styles/system/gaps";
import { space } from "styled-system";

const FlexBox = styled.div<FlexboxProps & SpaceProps>`
  display: flex;
  ${flexbox};
  ${space}
  ${compose(gapsSystem, flexbox)}
`;

export default FlexBox;

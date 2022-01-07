import { Text } from "@ledgerhq/react-ui";
import styled from "styled-components";

const AppName = styled(Text).attrs({
  variant: "body",
  fontWeight: "semiBold",
  fontSize: "14px",
  lineHeight: "17px",
  flexShrink: 1,
})`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export default AppName;

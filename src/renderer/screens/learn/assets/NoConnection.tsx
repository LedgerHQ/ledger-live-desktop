import { Flex } from "@ledgerhq/react-ui";
import noConnection from "~/renderer/images/noConnection.png";
import styled from "styled-components";

const NoConnectionIllustration = styled(Flex).attrs({
  height: "200px",
  width: "200px",
})`
  background-image: url(${noConnection});
  background-size: contain;
  ${p => p.theme.colors.type === "light" && "filter: invert(100%);"}
`;

export default NoConnectionIllustration;

import styled from "styled-components";
import { Flex } from "@ledgerhq/react-ui";
import { ThemedComponent } from "~/renderer/styles/StyleProvider";

const Cell: ThemedComponent<{}> = styled(Flex).attrs(() => ({
  padding: 9,
  flexDirection: "column",
  backgroundColor: "palette.neutral.c00",
  height: "275px",
}))`
  cursor: pointer;
  border-right: 1px solid ${p => p.theme.colors.palette.neutral.c40};
  border-bottom: 1px solid ${p => p.theme.colors.palette.neutral.c40};
`;

export default Cell;

// @flow
import React from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import IconTriangleWarning from "~/renderer/icons/TriangleWarning";
import Box from "~/renderer/components/Box";

const Disclaimer: ThemedComponent<{}> = styled(Box).attrs(() => ({
  horizontal: true,
  alignItems: "center",
  color: "palette.background.paper",
  borderRadius: 1,
  p: 3,
  mb: 5,
}))`
  width: 100%;
  background-color: ${p => p.theme.colors.lightRed};
  color: ${p => p.theme.colors.alertRed};
`;

function BroadcastErrorDisclaimer({ title }: { title: React$Node }) {
  return (
    <Disclaimer>
      <Box mr={3}>
        <IconTriangleWarning height={16} width={16} />
      </Box>
      <Box style={{ display: "block" }} ff="Inter|SemiBold" fontSize={3} horizontal shrink>
        {title}
      </Box>
    </Disclaimer>
  );
}

export default BroadcastErrorDisclaimer;

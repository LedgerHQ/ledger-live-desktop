// @flow
import React from "react";
import { Trans } from "react-i18next";
import styled from "styled-components";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Box from "~/renderer/components/Box";
import { radii } from "~/renderer/styles/theme";

const ElectionWarning = () => (
  <Container>
    <Trans i18nKey="polkadot.nomination.electionOpen" />
  </Container>
);

const Container: ThemedComponent<{}> = styled(Box).attrs(p => ({
  horizontal: true,
  alignItems: "center",
  py: "8px",
  px: 3,
  bg: p.theme.colors.warning,
  color: "palette.primary.contrastText",
  mb: 20,
  fontSize: 4,
  ff: "Inter|SemiBold",
}))`
  border-radius: ${radii[1]}px;
`;

export default ElectionWarning;

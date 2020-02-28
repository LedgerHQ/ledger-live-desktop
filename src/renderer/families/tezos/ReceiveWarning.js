// @flow
import React from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";

import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import InfoCircle from "~/renderer/icons/InfoCircle";

const IconWrapper = styled(Box).attrs(() => ({
  p: 4,
}))`
  align-self: center;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background-color: ${p => p.theme.colors.palette.action.hover};
`;

const ReceiveWarning = () => (
  <Box flow={4} px={5}>
    <IconWrapper color="palette.primary.main">
      <InfoCircle size={26} />
    </IconWrapper>

    <Box mt={25}>
      <Text ff="Inter|Regular" color="palette.text.shade80" textAlign="center" fontSize={4}>
        <Trans i18nKey="receive.steps.warning.tezos.text" />
      </Text>
    </Box>
  </Box>
);

const ReceiveWarningFooter = ({ transitionTo }: *) => (
  <Box horizontal alignItems="center" flow={2}>
    <Button primary onClick={() => transitionTo("account")}>
      <Trans i18nKey="common.continue" />
    </Button>
  </Box>
);

export default {
  component: ReceiveWarning,
  footer: ReceiveWarningFooter,
};

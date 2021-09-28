// @flow
import React, { useState, useEffect } from "react";
import { Trans } from "react-i18next";
import styled from "styled-components";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import ConnectTroubleshootingHelpButton from "~/renderer/components/ConnectTroubleshootingHelpButton";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

type Props = {
  appearsAfterDelay?: number,
  onRepair?: boolean => void,
};

const Wrapper: ThemedComponent<{}> = styled(Box).attrs({
  horizontal: true,
  alignItems: "center",
  backgroundColor: "palette.text.shade10",
  borderRadius: 4,
})`
  margin-top: 40px;
  max-width: 550px;
`;

const ConnectTroubleshooting = ({ appearsAfterDelay = 15000 }: Props) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), appearsAfterDelay);
    return () => clearTimeout(timeout);
  }, [appearsAfterDelay]);

  return visible ? (
    <Wrapper p={2} horizontal alignItems="center">
      <Box p={2} horizontal justifyContent="center">
        <Text ff="Inter|Regular" fontSize={4} color="palette.text.shade100">
          <Trans i18nKey="connectTroubleshooting.desc" />
        </Text>
      </Box>
      <Box flex="1" />
      <ConnectTroubleshootingHelpButton buttonProps={{ primary: true }} />
    </Wrapper>
  ) : null;
};

export default ConnectTroubleshooting;

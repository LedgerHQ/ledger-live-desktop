// @flow
import React, { useState, useEffect } from "react";
import { Trans } from "react-i18next";
import styled from "styled-components";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import ConnectTroubleshootingHelpLink from "~/renderer/components/ConnectTroubleshootingHelpLink";
import IconHelp from "~/renderer/icons/Help";
import RepairDeviceButton from "~/renderer/components/RepairDeviceButton";
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

const ConnectTroubleshooting = ({ appearsAfterDelay = 25000, onRepair }: Props) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), appearsAfterDelay);
    return () => clearTimeout(timeout);
  }, [appearsAfterDelay]);

  return visible ? (
    <Wrapper p={2} horizontal alignItems="center">
      <Box p={2} horizontal justifyContent="center">
        <Box marginRight="8px" justifyContent="center">
          <IconHelp size={16} />
        </Box>
        <Text ff="Inter|Regular" fontSize={4}>
          <Trans i18nKey="connectTroubleshooting.desc" />
        </Text>
      </Box>
      <ConnectTroubleshootingHelpLink />
      <Box flex="1" />
      {onRepair ? <RepairDeviceButton onRepair={onRepair} /> : null}
    </Wrapper>
  ) : null;
};

export default ConnectTroubleshooting;

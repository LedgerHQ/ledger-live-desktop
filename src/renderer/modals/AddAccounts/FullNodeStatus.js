// @flow

import React from "react";
import { Trans } from "react-i18next";
import styled from "styled-components";
import useSatStackStatus from "~/renderer/hooks/useSatStackStatus";
import type { SatStackStatus } from "@ledgerhq/live-common/lib/families/bitcoin/satstack";
import type { CryptoCurrency, TokenCurrency } from "@ledgerhq/live-common/lib/types";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Box from "~/renderer/components/Box";
import { Rotating } from "~/renderer/components/Spinner";
import ProgressCircle from "~/renderer/components/ProgressCircle";
import InfoBox from "~/renderer/components/InfoBox";
import Text from "~/renderer/components/Text";
import useEnv from "~/renderer/hooks/useEnv";

const Container: ThemedComponent<{}> = styled(Box).attrs(() => ({
  horizontal: true,
}))`
  padding: 16px;
  border-radius: 4px;
  align-items: center;
  background-color: ${p => p.theme.colors.palette.action.hover};
  color: ${p => p.theme.colors.palette.primary.main};
`;

const FullNodeStatus = ({ currency }: { currency?: ?(CryptoCurrency | TokenCurrency) }) => {
  const latestStatus: ?SatStackStatus = useSatStackStatus();
  const satStackAlreadyConfigured = useEnv("SATSTACK");

  if (!latestStatus || !satStackAlreadyConfigured) return null;
  // $FlowFixMe
  const { progress, type } = latestStatus;

  return currency?.id === "bitcoin" ? (
    type === "ready" ? (
      <Box mt={3}>
        <InfoBox>
          <Trans i18nKey="addAccounts.fullNodeReadyInfo" />
        </InfoBox>
      </Box>
    ) : (
      <Container mt={3}>
        {progress ? (
          <ProgressCircle size={50} progress={progress} />
        ) : (
          <Rotating size={50}>
            <ProgressCircle hideProgress size={50} progress={0.06} />
          </Rotating>
        )}
        <Box ml={3} flex={1}>
          <Text ff="Inter|SemiBold" fontSize={3} style={{ wordBreak: "break-word" }}>
            <Trans i18nKey={`fullNode.modal.steps.satstack.connectionSteps.${type}.header`} />
          </Text>
          <Text ff="Inter|Regular" fontSize={3} style={{ wordBreak: "break-word" }}>
            <Trans i18nKey={`fullNode.modal.steps.satstack.connectionSteps.${type}.description`} />
          </Text>
        </Box>
      </Container>
    )
  ) : null;
};

export default FullNodeStatus;

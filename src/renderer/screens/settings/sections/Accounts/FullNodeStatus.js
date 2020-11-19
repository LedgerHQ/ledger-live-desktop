// @flow
import React from "react";
import { useTranslation } from "react-i18next";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import styled from "styled-components";
import { colors } from "~/renderer/styles/theme";
import useEnv from "~/renderer/hooks/useEnv";
import useSatStackStatus from "~/renderer/hooks/useSatStackStatus";

const Dot: ThemedComponent<{
  color?: string,
}> = styled.div`
  background-color: ${p => p.color || colors.wallet};
  border-radius: 50%;
  width: 8px;
  height: 8px;
`;
const Wrapper = styled(Box)`
  background-color: ${p => p.theme.colors.palette.background.default};
  border-radius: 4px;
  padding: 12px 20px;
  display: flow;
`;

const naiveMapping = {
  ko: ["satstack-disconnected", "node-disconnected", "invalid-chain"],
  ok: ["ready"],
  pending: ["syncing", "scanning", "initializing"],
};

const FullNodeStatus = () => {
  const { t } = useTranslation();
  const latestStatus = useSatStackStatus();
  const satStackAlreadyConfigured = useEnv("SATSTACK");
  if (!satStackAlreadyConfigured) return null;

  const status = (latestStatus && latestStatus.type) || "";
  const color = naiveMapping.ok.includes(status)
    ? colors.positiveGreen
    : naiveMapping.pending.includes(status)
    ? colors.orange
    : colors.alertRed;

  const statusLabel = `${t("fullNode.status")}:`;
  return (
    <Box horizontal>
      <Wrapper horizontal alignItems="center">
        <Text mr={2} ff="Inter|Regular" fontSize={3} color={"palette.text.shade50"}>
          {statusLabel}
        </Text>
        <Dot color={color} />
        <Text ml={1} ff="Inter|SemiBold" fontSize={3} color={"palette.text.shade100"}>
          {status}
        </Text>
      </Wrapper>
      <Box flex={1} />
    </Box>
  );
};

export default FullNodeStatus;

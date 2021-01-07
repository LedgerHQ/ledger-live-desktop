// @flow
import React from "react";
import { useTranslation, Trans } from "react-i18next";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import { Rotating } from "~/renderer/components/Spinner";
import IconBlueSpinner from "~/renderer/icons/BlueSpinner";
import Tooltip from "~/renderer/components/Tooltip";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import styled from "styled-components";
import { colors } from "~/renderer/styles/theme";
import useEnv from "~/renderer/hooks/useEnv";
import useSatStackStatus from "~/renderer/hooks/useSatStackStatus";
import type { SatStackStatus } from "@ledgerhq/live-common/lib/families/bitcoin/satstack";

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

const getColorsForStatus = status => {
  // FIXME this knowledge should be in live-common (because we may add more status)
  // FIXME we should make it a map of {status->type} because it's more usable and also better to prove to Flow we have define all cases
  const naiveMapping = {
    ko: ["satstack-disconnected", "node-disconnected", "invalid-chain", "satstack-outdated"],
    ok: ["ready"],
    pending: ["syncing", "scanning", "initializing"],
  };

  return naiveMapping.ko.includes(status)
    ? {
        textColor: colors.alertRed,
        dotColor: colors.alertRed,
      }
    : naiveMapping.ok.includes(status)
    ? {
        textColor: "palette.text.shade100",
        dotColor: colors.positiveGreen,
      }
    : {
        textColor: "wallet",
      };
};

const FullNodeStatus = () => {
  const { t } = useTranslation();
  const latestStatus: SatStackStatus = useSatStackStatus() || { type: "initializing" };
  const satStackAlreadyConfigured = useEnv("SATSTACK");
  if (!satStackAlreadyConfigured) return null;

  // $FlowFixMe
  const { progress, type } = latestStatus;
  // $FlowFixMe
  const { textColor, dotColor } = getColorsForStatus(type);

  const formattedProgress = progress ? (parseFloat(progress) * 100).toFixed(0) : undefined;
  const statusLabel = `${t("fullNode.status")}:`;
  return (
    <Box horizontal>
      <Tooltip
        content={
          <Trans i18nKey={`fullNode.modal.steps.satstack.connectionSteps.${type}.description`} />
        }
      >
        <Wrapper horizontal alignItems="center">
          <Text mr={2} ff="Inter|Regular" fontSize={3} color={"palette.text.shade50"}>
            {statusLabel}
          </Text>
          {progress && formattedProgress ? (
            <>
              <Rotating size={16}>
                <IconBlueSpinner size={16} />
              </Rotating>
              <Text ml={1} ff="Inter|SemiBold" fontSize={3} color={textColor}>
                {`${formattedProgress} %`}
              </Text>
            </>
          ) : (
            <Dot color={dotColor} />
          )}

          <Text ml={1} ff="Inter|SemiBold" fontSize={3} color={textColor}>
            <Trans i18nKey={`fullNode.modal.steps.satstack.connectionSteps.${type}.header`} />
          </Text>
        </Wrapper>
      </Tooltip>
      <Box flex={1} />
    </Box>
  );
};

export default FullNodeStatus;

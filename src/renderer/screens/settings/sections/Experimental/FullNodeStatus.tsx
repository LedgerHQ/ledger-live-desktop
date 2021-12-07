import React from "react";
import { useTranslation, Trans } from "react-i18next";
import { Flex, Text, Tooltip, InfiniteLoader } from "@ledgerhq/react-ui";
import { SectionRow as Row } from "../../Rows";
import styled from "styled-components";
import useSatStackStatus from "~/renderer/hooks/useSatStackStatus";
import type { SatStackStatus } from "@ledgerhq/live-common/lib/families/bitcoin/satstack";
import useEnv from "~/renderer/hooks/useEnv";

const Dot = styled(Flex)`
  border-radius: 50%;
  width: 8px;
  height: 8px;
`;

const getColorsForStatus = (status: string) => {
  const naiveMapping = {
    ko: ["satstack-disconnected", "node-disconnected", "invalid-chain", "satstack-outdated"],
    ok: ["ready"],
    pending: ["syncing", "scanning", "initializing"],
  };

  return naiveMapping.ko.includes(status)
    ? "error.c100" : 
      naiveMapping.ok.includes(status)
      ? "success.c100" : 
        "primary.c100";
};

const FullNodeStatus = () => {
  const { t } = useTranslation();
  const latestStatus: SatStackStatus = useSatStackStatus() || { type: "initializing" };
  const satStackAlreadyConfigured = useEnv("SATSTACK");
  if (!satStackAlreadyConfigured) return null;

  const { type } = latestStatus;
  const statusColor = getColorsForStatus(type);

  const formattedProgress = latestStatus.type === "syncing" || latestStatus.type === "scanning" ? (latestStatus.progress * 100).toFixed(0) : undefined;
  const statusLabel = `${t("fullNode.status")}:`;
  return (
    
    <Row
      inset
      title={statusLabel}
      desc={(  
        <Tooltip
          content={t(`fullNode.modal.steps.satstack.connectionSteps.${type}.description`)}
        >
          <Flex mt={5} alignItems="center" columnGap={3} px={5}>
              {formattedProgress ? (
                <>
                  <InfiniteLoader />
                  <Text ml={1} ff="Inter|SemiBold" fontSize={3} color={statusColor}>
                    {`${formattedProgress} %`}
                  </Text>
                </>
              ) : (
                <Dot backgroundColor={statusColor} />
              )}
              <Text ml={1} ff="Inter|SemiBold" fontSize={3} color={statusColor}>
                <Trans i18nKey={`fullNode.modal.steps.satstack.connectionSteps.${type}.header`} />
              </Text>  
          </Flex>    
        </Tooltip>
      )}
    />    
  );
};

export default FullNodeStatus;

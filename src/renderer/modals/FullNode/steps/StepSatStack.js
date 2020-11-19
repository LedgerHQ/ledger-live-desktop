// @flow
import React, { useCallback } from "react";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import InfoBox from "~/renderer/components/InfoBox";
import { Trans } from "react-i18next";
import Button from "~/renderer/components/Button";
import BigSpinner from "~/renderer/components/BigSpinner";
import ProgressCircle from "~/renderer/components/ProgressCircle";
import IconCheck from "~/renderer/icons/Check";
import IconCross from "~/renderer/icons/Cross";
import { CheckWrapper, CrossWrapper } from "~/renderer/modals/FullNode";
import { openURL } from "~/renderer/linking";
import { urls } from "~/config/urls";
import useSatStackStatus from "~/renderer/hooks/useSatStackStatus";
import type { SatStackStatus } from "@ledgerhq/live-common/lib/families/bitcoin/satstack";

const SatStack = ({
  satStackDownloaded,
  setSatStackDownloaded,
}: {
  satStackDownloaded: boolean,
  setSatStackDownloaded: boolean => void,
}) => {
  const latestStatus: SatStackStatus = useSatStackStatus() || { type: "initializing" };
  // $FlowFixMe
  const { progress, type } = latestStatus;

  const onSatStackDownloaded = useCallback(() => {
    setSatStackDownloaded(true);
    openURL(urls.satstacks);
  }, [setSatStackDownloaded]);

  return !satStackDownloaded ? (
    <Box>
      <Text ff="Inter|SemiBold" textAlign={"center"} fontSize={6} color="palette.text.shade100">
        <Trans i18nKey="fullNode.modal.steps.satstack.connectionSteps.notConnected.header" />
      </Text>
      <Text
        ff="Inter|Medium"
        textAlign={"center"}
        fontSize={4}
        color="palette.text.shade50"
        my={24}
      >
        <Trans i18nKey="fullNode.modal.steps.satstack.connectionSteps.notConnected.description" />
      </Text>
      <Box alignItems={"center"} mb={6}>
        <Button primary onClick={onSatStackDownloaded}>
          <Trans i18nKey="fullNode.modal.steps.satstack.connectionSteps.notConnected.cta" />
        </Button>
      </Box>
      <InfoBox
        type="secondary"
        onLearnMore={() => {
          /* TODO Implement this */
        }}
      >
        <Text ff="Inter|Regular" fontSize={3} color="palette.text.shade50">
          <Trans i18nKey="fullNode.modal.steps.satstack.connectionSteps.notConnected.disclaimer" />
        </Text>
      </InfoBox>
    </Box>
  ) : (
    <Box alignItems="center">
      {type === "ready" ? (
        <CheckWrapper size={50}>
          <IconCheck size={20} />
        </CheckWrapper>
      ) : progress ? (
        <ProgressCircle size={50} progress={progress || 1} />
      ) : (
        <BigSpinner size={50} />
      )}
      <Text
        ff="Inter|SemiBold"
        textAlign={"center"}
        mt={32}
        fontSize={6}
        color="palette.text.shade100"
      >
        <Trans i18nKey={`fullNode.modal.steps.satstack.connectionSteps.${type}.header`} />
      </Text>
      <Text
        ff="Inter|Regular"
        mt={2}
        textAlign={"center"}
        fontSize={3}
        color="palette.text.shade50"
      >
        <Trans i18nKey={`fullNode.modal.steps.satstack.connectionSteps.${type}.description`} />
      </Text>
    </Box>
  );
};

export const StepSatStackFooter = ({
  satStackDownloaded,
  onClose,
}: {
  satStackDownloaded: boolean,
  onClose: () => void,
}) => {
  const latestStatus: SatStackStatus = useSatStackStatus() || { type: "initializing" };
  const { type } = latestStatus;

  return (
    <Box horizontal alignItems={"flex-end"}>
      <Button mr={3} onClick={onClose}>
        <Trans i18nKey="common.cancel" />
      </Button>
      <Button primary onClick={onClose} disabled={!satStackDownloaded || type !== "ready"}>
        <Trans i18nKey="common.done" />
      </Button>
    </Box>
  );
};

export default SatStack;

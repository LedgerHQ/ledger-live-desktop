// @flow
import React, { useCallback, useState } from "react";
import { useObservable } from "@ledgerhq/live-common/lib/observable";
import { statusObservable } from "@ledgerhq/live-common/lib/families/bitcoin/satstack";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import BigSpinner from "~/renderer/components/BigSpinner";
import InfoBox from "~/renderer/components/InfoBox";
import { Trans } from "react-i18next";
import Button from "~/renderer/components/Button";
import IconCheck from "~/renderer/icons/Check";
import IconCross from "~/renderer/icons/Cross";
import { CheckWrapper, CrossWrapper } from "~/renderer/modals/FullNode";

const SatStack = () => {
  const latestStatus = useObservable(statusObservable, { type: "satstack-disconnected" });
  const status = (latestStatus && latestStatus.type) || "";
  const [satStackDownloaded, setSatStackDownloaded] = useState(false);
  const onSatStackDownloaded = useCallback(() => setSatStackDownloaded(true), []);

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
  ) : status === "syncing" ? (
    <Box alignItems="center">
      <BigSpinner size={50} />
      <Text
        ff="Inter|SemiBold"
        textAlign={"center"}
        mt={32}
        fontSize={6}
        color="palette.text.shade100"
      >
        <Trans i18nKey="fullNode.modal.steps.satstack.connectionSteps.syncing.header" />
      </Text>
      <Text
        ff="Inter|Regular"
        mt={2}
        textAlign={"center"}
        fontSize={3}
        color="palette.text.shade50"
      >
        <Trans i18nKey="fullNode.modal.steps.satstack.connectionSteps.syncing.description" />
      </Text>
    </Box>
  ) : status === "scanning" ? (
    <Box alignItems="center">
      <CheckWrapper size={50}>
        <IconCheck size={20} />
      </CheckWrapper>
      <Text
        ff="Inter|SemiBold"
        textAlign={"center"}
        mt={32}
        fontSize={6}
        color="palette.text.shade100"
      >
        <Trans i18nKey="fullNode.modal.steps.satstack.connectionSteps.success.header" />
      </Text>
      <Text
        ff="Inter|Regular"
        mt={2}
        textAlign={"center"}
        fontSize={3}
        color="palette.text.shade50"
      >
        <Trans i18nKey="fullNode.modal.steps.satstack.connectionSteps.success.description" />
      </Text>
    </Box>
  ) : (
    <Box alignItems="center">
      <CrossWrapper size={50}>
        <IconCross size={20} />
      </CrossWrapper>
      <Text
        ff="Inter|SemiBold"
        textAlign={"center"}
        mt={32}
        fontSize={6}
        color="palette.text.shade100"
      >
        <Trans i18nKey="fullNode.modal.steps.satstack.connectionSteps.failure.header" />
      </Text>
      <Text
        ff="Inter|Regular"
        mt={2}
        textAlign={"center"}
        fontSize={3}
        color="palette.text.shade50"
      >
        <Trans i18nKey="fullNode.modal.steps.satstack.connectionSteps.failure.description" />
      </Text>
      <Text
        ff="Inter|Regular"
        mt={2}
        textAlign={"center"}
        fontSize={3}
        color="palette.text.shade50"
      >
        {status}
      </Text>
    </Box>
  );
};

export const StepSatStackFooter = ({ onClose }: { onClose: () => void }) => {
  const latestStatus = useObservable(statusObservable, { type: "satstack-disconnected" });
  const status = (latestStatus && latestStatus.type) || "";

  return (
    <Box horizontal alignItems={"flex-end"}>
      <Button mr={3} onClick={onClose}>
        <Trans i18nKey="common.cancel" />
      </Button>
      <Button primary onClick={onClose} disabled={status !== "ready"}>
        <Trans i18nKey="common.done" />
      </Button>
    </Box>
  );
};

export default SatStack;

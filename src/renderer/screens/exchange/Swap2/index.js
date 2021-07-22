// @flow
import React from "react";
import { Trans } from "react-i18next";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box, { Card } from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import { SwapFormSummary } from "./Form";
import FormInputs from "./Form/FormInputs";
import { FORM_CONTAINER_WIDTH } from "./Form/utils";

// SWAP MOCK - PLEASE REMOVE ME ASA LOGIC IS IMPLEMENTED
const mockData = {
  fees: "0.000034 ETH",
  rate: "1 ETH = 0,06265846 BTC",
  provider: "Changelly",
  onProviderChange: () => {},
  onFeesChange: () => {},
  onTargetChange: () => {},
};

const Swap2 = () => {
  return (
    <>
      <TrackPage category="Swap" />
      <Text horizontal mb={20} ff="Inter|SemiBold" fontSize={7} color="palette.text.shade100">
        <Trans i18nKey="swap.title" />
      </Text>
      <Card p={30}>
        <Text ff="Inter|Regular" fontSize={4}>
          {"This is the new and improved swap"}
        </Text>
      </Card>
      {/* SWAP MOCK - PLEASE REMOVE ME ASA CONTAINER IS INTEGRATED */}
      <Card p={20} style={{ maxWidth: FORM_CONTAINER_WIDTH }}>
        <Box mb={6}>
          <FormInputs />
        </Box>
        <SwapFormSummary {...mockData} />
      </Card>
    </>
  );
};

export default Swap2;

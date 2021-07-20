// @flow
import React from "react";
import { Trans } from "react-i18next";
import TrackPage from "~/renderer/analytics/TrackPage";
import { Card } from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";

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
    </>
  );
};

export default Swap2;

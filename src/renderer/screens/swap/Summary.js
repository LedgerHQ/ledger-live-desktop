// @flow

import React from "react";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import { Trans } from "react-i18next";
import Card from "~/renderer/components/Box/Card";

const Summary = () => {
  return (
    <Box flow={4}>
      <TrackPage category="Swap form" />
      <Box horizontal style={{ paddingBottom: 32 }}>
        <Box
          grow
          ff="Inter|SemiBold"
          fontSize={7}
          color="palette.text.shade100"
          data-e2e="swapPage_title"
        >
          <Trans i18nKey="swap.title" />
        </Box>
      </Box>
      <Card p={32} flow={1}>
        {"Some content"}
      </Card>
    </Box>
  );
};

export default Summary;

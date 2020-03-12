// @flow

import React from "react";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import { Trans, withTranslation } from "react-i18next";
import Button from "~/renderer/components/Button";
import DeviceAction from "~/renderer/components/DeviceAction";
import { action } from "~/renderer/components/DeviceAction/actions/manager";

const Connect = ({
  setResult,
  setSkipDeviceAction,
}: {
  setResult: () => undefined,
  setSkipDeviceAction: () => undefined,
}) => {
  return (
    <Box flex={1}>
      <TrackPage category="Swap" />
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
      <Box flex={1}>
        <DeviceAction onResult={setResult} action={action} request={null} />
        <Box alignItems="flex-end">
          <Button danger onClick={() => setSkipDeviceAction(true)}>
            {"Dev skip"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Connect;

// @flow

import React from "react";
import Modal, { ModalBody } from "~/renderer/components/Modal";
import Box from "~/renderer/components/Box";
import DeviceAction from "~/renderer/components/DeviceAction";
import { createAction } from "@ledgerhq/live-common/lib/hw/actions/startExchange";
import { command } from "~/renderer/commands";

const connectAppExec = command("connectApp");
const startExchangeExec = command("startExchange");
const action = createAction(connectAppExec, startExchangeExec);

const StartExchange = () => {
  return (
    <Modal
      name="MODAL_PLATFORM_EXCHANGE_START"
      centered
      render={({ data, onClose }) => (
        <ModalBody
          onClose={onClose}
          render={() => (
            <Box alignItems={"center"} px={32}>
              <DeviceAction
                action={action}
                request={{ exchangeType: data.exchangeType }}
                onResult={({ startExchangeResult }) => {
                  data.onResult(startExchangeResult);
                  onClose();
                }}
              />
            </Box>
          )}
        />
      )}
    />
  );
};

export default StartExchange;

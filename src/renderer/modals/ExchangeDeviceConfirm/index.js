// @flow
import React from "react";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";
import { getEnv } from "@ledgerhq/live-common/lib/env";
import { getMainAccount } from "@ledgerhq/live-common/lib/account";
import { createAction } from "@ledgerhq/live-common/lib/hw/actions/app";
import { mockedAppExec } from "~/renderer/components/DebugMock";
import DeviceAction from "~/renderer/components/DeviceAction";
import Modal from "~/renderer/components/Modal";
import ModalBody from "~/renderer/components/Modal/ModalBody";
import Box from "~/renderer/components/Box";
import { command } from "~/renderer/commands";

const connectAppExec = command("connectApp");

const action = createAction(getEnv("MOCK") ? mockedAppExec : connectAppExec);

type Props = {
  onClose: () => null,
  data: ?{
    account: AccountLike,
    parentAccount: ?Account,
    onResult: any => null,
  },
};

const Root = ({ data, onClose }: Props) => {
  if (!data) return <Box />;
  const { account, parentAccount, onResult } = data;
  const mainAccount = getMainAccount(account, parentAccount);
  const tokenCurrency = account.type === "TokenAccount" ? account.token : null;
  return (
    <Box flow={2}>
      <DeviceAction
        action={action}
        request={{ account: mainAccount, tokenCurrency }}
        onResult={res => {
          onResult(account, res);
          onClose();
        }}
      />
    </Box>
  );
};

const BuyCrypto = () => {
  return (
    <Modal
      name="MODAL_EXCHANGE_CRYPTO_DEVICE"
      centered
      render={({ data, onClose }) => (
        <ModalBody
          onClose={onClose}
          title="Connect your device"
          render={() => <Root data={data} onClose={onClose} />}
        />
      )}
    />
  );
};

export default BuyCrypto;

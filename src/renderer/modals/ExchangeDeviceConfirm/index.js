// @flow
import React, { useCallback, useEffect, useState } from "react";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import { getEnv } from "@ledgerhq/live-common/lib/env";
import { getAccountName, getMainAccount } from "@ledgerhq/live-common/lib/account";
import { createAction } from "@ledgerhq/live-common/lib/hw/actions/app";
import DeviceAction from "~/renderer/components/DeviceAction";
import Modal from "~/renderer/components/Modal";
import ModalBody from "~/renderer/components/Modal/ModalBody";
import Box from "~/renderer/components/Box";
import { command } from "~/renderer/commands";
import { useSelector } from "react-redux";
import { getCurrentDevice } from "~/renderer/reducers/devices";
import Text from "~/renderer/components/Text";
import Ellipsis from "~/renderer/components/Ellipsis";
import { Trans } from "react-i18next";
import ReadOnlyAddressField from "~/renderer/components/ReadOnlyAddressField";
import { renderVerifyUnwrapped } from "~/renderer/components/DeviceAction/rendering";
import useTheme from "~/renderer/hooks/useTheme";
import { Separator } from "~/renderer/components/Breadcrumb/common";
import { mockedEventEmitter } from "~/renderer/components/DebugMock";
import type { Device } from "@ledgerhq/live-common/lib/hw/actions/types";

const connectAppExec = command("connectApp");

const action = createAction(getEnv("MOCK") ? mockedEventEmitter : connectAppExec);

const Receive1ShareAddress = ({ name, address }: { name: string, address: string }) => {
  return (
    <>
      <Box horizontal alignItems="center" flow={2} mb={4}>
        <Text style={{ flex: 1 }} ff="Inter|SemiBold" color="palette.text.shade100" fontSize={4}>
          {name ? (
            <Ellipsis>
              <Trans i18nKey="currentAddress.for">
                {"Address for "}
                <strong>{name}</strong>
              </Trans>
            </Ellipsis>
          ) : (
            <Trans i18nKey="currentAddress.title" />
          )}
        </Text>
      </Box>
      <ReadOnlyAddressField address={address} allowCopy={false} />
    </>
  );
};

type VerifyOnDeviceProps = {
  mainAccount: Account,
  onAddressVerified: (status: boolean, err?: any) => void,
  device: ?Device,
};

const VerifyOnDevice = ({ mainAccount, onAddressVerified, device }: VerifyOnDeviceProps) => {
  const name = getAccountName(mainAccount);
  const address = mainAccount.freshAddress;

  const confirmAddress = useCallback(async () => {
    if (!device) return null;
    try {
      if (getEnv("MOCK")) {
        setTimeout(() => {
          onAddressVerified(true);
        }, 3000);
      } else {
        await getAccountBridge(mainAccount)
          .receive(mainAccount, {
            deviceId: device.deviceId,
            verify: true,
          })
          .toPromise();

        onAddressVerified(true);
      }
    } catch (err) {
      onAddressVerified(false, err);
    }
  }, [device, onAddressVerified, mainAccount]);

  useEffect(() => {
    confirmAddress();
  }, [confirmAddress]);

  const type = useTheme("colors.palette.type");

  return device ? (
    <>
      <Receive1ShareAddress name={name} address={address} />
      <Separator />
      <Box horizontal alignItems="center" flow={2}>
        <Text
          style={{ flexShrink: "unset" }}
          ff="Inter|SemiBold"
          color="palette.text.shade100"
          fontSize={4}
        >
          <span style={{ marginRight: 10 }}>
            <Trans i18nKey="exchange.verifyAddress" />
          </span>
        </Text>
      </Box>
      {renderVerifyUnwrapped({ modelId: device.modelId, type })}
    </>
  ) : null;
};

type Props = {
  onClose: () => void,
  data: {
    account: AccountLike,
    parentAccount: ?Account,
    onResult: (AccountLike, ?Account, any) => null,
    verifyAddress?: boolean,
  },
};

const Root = ({ data, onClose }: Props) => {
  const [waitingForDevice, setWaitingForDevice] = useState(false);
  const device = useSelector(getCurrentDevice);

  const { account, parentAccount, onResult, verifyAddress } = data;
  const mainAccount = getMainAccount(account, parentAccount);
  const tokenCurrency = account.type === "TokenAccount" ? account.token : null;

  const handleResult = useCallback(
    (res: any) => {
      if (!verifyAddress) {
        onResult(account, parentAccount, res);
        onClose();
      } else {
        setWaitingForDevice(true);
      }
    },
    [verifyAddress, onResult, account, parentAccount, onClose],
  );

  return (
    <Box flow={2}>
      {waitingForDevice ? (
        <VerifyOnDevice
          mainAccount={mainAccount}
          device={device}
          onAddressVerified={status => {
            if (status) {
              onResult(account);
            }
            onClose();
          }}
        />
      ) : (
        <DeviceAction
          action={action}
          request={{ account: mainAccount, tokenCurrency }}
          onResult={handleResult}
        />
      )}
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
          onClose={() => {
            if (data.onCancel) {
              data.onCancel();
            }
            onClose();
          }}
          title="Connect your device"
          render={() =>
            data ? (
              <Root
                data={data}
                onClose={() => {
                  if (data.onCancel) {
                    data.onCancel();
                  }
                  onClose();
                }}
              />
            ) : null
          }
        />
      )}
    />
  );
};

export default BuyCrypto;

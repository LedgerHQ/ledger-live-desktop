// @flow
import React, { useCallback, useEffect, useState } from "react";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";
import { getEnv } from "@ledgerhq/live-common/lib/env";
import { getAccountName, getMainAccount } from "@ledgerhq/live-common/lib/account";
import { createAction } from "@ledgerhq/live-common/lib/hw/actions/app";
import DeviceAction from "~/renderer/components/DeviceAction";
import Modal from "~/renderer/components/Modal";
import ModalBody from "~/renderer/components/Modal/ModalBody";
import Box from "~/renderer/components/Box";
import { command } from "~/renderer/commands";
import { WrongDeviceForAccount } from "@ledgerhq/errors";
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
  device: any,
};

const VerifyOnDevice = ({ mainAccount, onAddressVerified, device }: VerifyOnDeviceProps) => {
  const name = getAccountName(mainAccount);
  const address = mainAccount.freshAddress;

  const confirmAddress = useCallback(async () => {
    try {
      if (getEnv("MOCK")) {
        setTimeout(() => {
          onAddressVerified(true);
        }, 3000);
      } else {
        const { address } = await command("getAddress")({
          derivationMode: mainAccount.derivationMode,
          currencyId: mainAccount.currency.id,
          devicePath: device.path,
          path: mainAccount.freshAddressPath,
          verify: true,
        }).toPromise();
        if (address !== mainAccount.freshAddress) {
          throw new WrongDeviceForAccount(`WrongDeviceForAccount ${mainAccount.name}`, {
            accountName: mainAccount.name,
          });
        }
        onAddressVerified(true);
      }
    } catch (err) {
      onAddressVerified(false, err);
    }
  }, [mainAccount, onAddressVerified, device.path]);

  useEffect(() => {
    confirmAddress();
  }, [confirmAddress]);

  const type = useTheme("colors.palette.type");

  return (
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
  );
};

type Props = {
  onClose: () => null,
  data: {
    account: AccountLike,
    parentAccount: ?Account,
    onResult: (AccountLike, any) => null,
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
        onResult(account, res);
        onClose();
      } else {
        setWaitingForDevice(true);
      }
    },
    [onResult, onClose, account, verifyAddress],
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
          onClose={onClose}
          title="Connect your device"
          render={() => (data ? <Root data={data} onClose={onClose} /> : null)}
        />
      )}
    />
  );
};

export default BuyCrypto;

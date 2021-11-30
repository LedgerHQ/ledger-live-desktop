// @flow
import React, { useCallback, useEffect, useState } from "react";
import type { Device } from "@ledgerhq/live-common/lib/hw/actions/types";
import styled from "styled-components";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import { getEnv } from "@ledgerhq/live-common/lib/env";
import { getAccountName, getMainAccount } from "@ledgerhq/live-common/lib/account";
import { createAction } from "@ledgerhq/live-common/lib/hw/actions/app";
import { urls } from "~/config/urls";
import DeviceAction from "~/renderer/components/DeviceAction";
import Modal from "~/renderer/components/Modal";
import ModalBody from "~/renderer/components/Modal/ModalBody";
import Box from "~/renderer/components/Box";
import { command } from "~/renderer/commands";
import { useSelector } from "react-redux";
import { getCurrentDevice } from "~/renderer/reducers/devices";
import Text from "~/renderer/components/Text";
import Ellipsis from "~/renderer/components/Ellipsis";
import { Trans, useTranslation } from "react-i18next";
import ReadOnlyAddressField from "~/renderer/components/ReadOnlyAddressField";
import { renderVerifyUnwrapped } from "~/renderer/components/DeviceAction/rendering";
import useTheme from "~/renderer/hooks/useTheme";
import { mockedEventEmitter } from "~/renderer/components/debug/DebugMock";
import Button from "~/renderer/components/Button";
import Alert from "~/renderer/components/Alert";
import TrackPage from "~/renderer/analytics/TrackPage";
import Receive2NoDevice from "~/renderer/components/Receive2NoDevice";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

export const Separator: ThemedComponent<{}> = styled.div`
  &::after {
    content: "";
    font-size: 13px;
    color: ${p => p.theme.colors.palette.divider};
    padding: 0 15px;
  }
`;

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
  skipDevice: boolean,
};

const VerifyOnDevice = ({
  mainAccount,
  onAddressVerified,
  device,
  skipDevice,
}: VerifyOnDeviceProps) => {
  const name = getAccountName(mainAccount);
  const address = mainAccount.freshAddress;

  const confirmAddress = useCallback(async () => {
    if (!device || skipDevice) return null;
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
  }, [device, onAddressVerified, mainAccount, skipDevice]);

  useEffect(() => {
    confirmAddress();
  }, [confirmAddress]);

  const type = useTheme("colors.palette.type");

  return device || skipDevice ? (
    <>
      <Receive1ShareAddress name={name} address={address} />
      {!skipDevice ? (
        <>
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
        </>
      ) : (
        <Alert type="security" learnMoreUrl={urls.recipientAddressInfo} mt={4}>
          <Trans i18nKey="currentAddress.messageIfSkipped" values={{ name }} />
        </Alert>
      )}
      {device && renderVerifyUnwrapped({ modelId: device.modelId, type })}
    </>
  ) : null;
};

type Props = {
  onClose: () => void,
  skipDevice: boolean,
  data: {
    account: AccountLike,
    parentAccount: ?Account,
    onResult: (AccountLike, ?Account, any) => null,
    verifyAddress?: boolean,
  },
  flow?: string,
};

type PropsFooter = {
  onClose: () => null,
  onSkipDevice: Function,
  data: {
    account: AccountLike,
    parentAccount: ?Account,
    onResult: (AccountLike, ?Account, any) => null,
    verifyAddress?: boolean,
  },
};

const Root = ({ data, onClose, skipDevice, flow }: Props) => {
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
      {waitingForDevice || skipDevice ? (
        <VerifyOnDevice
          mainAccount={mainAccount}
          device={device}
          skipDevice={skipDevice}
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
          analyticsPropertyFlow={flow}
        />
      )}
    </Box>
  );
};

const StepConnectDeviceFooter = ({ data, onClose, onSkipDevice }: PropsFooter) => {
  const { t } = useTranslation();
  const [skipClicked, setSkipClicked] = useState(false);

  const { account, parentAccount, onResult } = data;
  const mainAccount = getMainAccount(account, parentAccount);
  const name = getAccountName(mainAccount);

  const nextStep = () => {
    onResult(account, parentAccount, true);
    onClose();
  };

  return !skipClicked ? (
    <Box horizontal flow={2}>
      <TrackPage category="Buy Flow" name="Step 1" />
      <Button
        primary
        inverted
        event="Buy Flow Without Device Clicked"
        id={"buy-connect-device-skip-device-button"}
        onClick={() => {
          if (data.verifyAddress) {
            setSkipClicked(true);
            onSkipDevice(true);
          } else {
            nextStep();
          }
        }}
      >
        {t("buy.withoutDevice")}
      </Button>
    </Box>
  ) : (
    <Box alignItems="center" shrink flow={2}>
      <Receive2NoDevice
        name={name}
        onVerify={() => {
          setSkipClicked(false);
          onSkipDevice(false);
        }}
        onContinue={nextStep}
      />
    </Box>
  );
};

const BuyCrypto = ({ flow }: { flow?: string }) => {
  const [skipDevice, setSkipDevice] = useState(false);
  const device = useSelector(getCurrentDevice);
  const { t } = useTranslation();

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
          title={t("common.connectDevice")}
          renderFooter={() =>
            data && !device ? (
              <StepConnectDeviceFooter
                data={data}
                onClose={onClose}
                onSkipDevice={v => {
                  setSkipDevice(v);
                }}
              />
            ) : null
          }
          render={() =>
            data ? <Root data={data} skipDevice={skipDevice} onClose={onClose} flow={flow} /> : null
          }
        />
      )}
    />
  );
};

export default BuyCrypto;

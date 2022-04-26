import React, { useRef, useState, useCallback, useEffect } from "react";
import { Trans } from "react-i18next";
import { useTheme } from "styled-components";
import { Divider, Box, Log, Icons, Flex, Text, Link, Button, Alert } from "@ledgerhq/react-ui";
import { DisconnectedDevice } from "@ledgerhq/errors";
import { Device } from "@ledgerhq/hw-transport";
import { getMainAccount } from "@ledgerhq/live-common/lib/account";
import { Account, AccountLike } from "@ledgerhq/live-common/lib/types";
import { getEnv } from "@ledgerhq/live-common/lib/env";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import TrackPage from "~/renderer/analytics/TrackPage";
import { renderVerifyUnwrapped } from "~/renderer/components/DeviceAction/rendering";
import ReadOnlyAddressField from "~/renderer/components/ReadOnlyAddressField";
import { openURL } from "~/renderer/linking";
import { urls } from "~/config/urls";
import QRCode from "~/renderer/components/QRCode";

type Props = {
  account?: AccountLike;
  parentAccount?: Account;
  currencyName?: string;
  eventType?: string;
  device: Device;
  isAddressVerified?: boolean;
  onChangeAddressVerified: (isAddressVerified?: boolean, err?: Error) => void;
};

export function StepVerifyAddress({
  account,
  parentAccount,
  currencyName,
  eventType,
  device,
  onChangeAddressVerified,
}: Props) {
  const theme = useTheme();
  const [showQrCode, setShowQrCode] = useState(false);
  const mainAccount = account ? getMainAccount(account, parentAccount) : null;
  if (!account || !mainAccount) {
    throw new Error("No account given");
  }
  const initialDevice = useRef(device);
  const address = mainAccount.freshAddress;

  useEffect(() => {
    (async () => {
      try {
        if (getEnv("MOCK")) {
          setTimeout(() => {
            onChangeAddressVerified(true);
          }, 3000);
        } else {
          if (!device) {
            // @ts-expect-error TS doesn't like ledgerhq/errors
            throw new DisconnectedDevice();
          }
          await getAccountBridge(mainAccount)
            .receive(mainAccount, {
              deviceId: device.deviceId,
              verify: true,
            })
            .toPromise();
          onChangeAddressVerified(true);
        }
      } catch (err) {
        onChangeAddressVerified(false, err as Error);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Flex flex={1} flexDirection="column" justifyContent="space-between" rowGap={12}>
      <TrackPage
        category={`Receive Flow${eventType ? ` (${eventType})` : ""}`}
        name="Step 3"
        currencyName={currencyName || ""}
      />
      <Flex flexDirection="column" rowGap={8}>
        {renderVerifyUnwrapped({
          modelId: initialDevice.current.modelId,
          type: theme.colors.type as "light" | "dark",
        })}
        <Log extraTextProps={{ variant: "h5" }}>
          <Trans i18nKey="v3.receive.steps.receiveFunds.verificationMessage" />
        </Log>
        <Link onClick={() => openURL(urls.recipientAddressInfo)} Icon={Icons.ExternalLinkMedium}>
          <Trans i18nKey="common.learnMore" />
        </Link>
      </Flex>
      <Flex flexDirection="column" rowGap={2}>
        <Flex alignItems="center" justifyContent="space-between" mb={5}>
          <Text variant="subtitle" color="neutral.c80">
            <Trans i18nKey="v3.receive.steps.receiveFunds.address" />
          </Text>
          <Text color="neutral.c100">
            <ReadOnlyAddressField address={address} />
          </Text>
        </Flex>
        <Divider variant="light" />
        <Flex alignItems="center" justifyContent="space-between">
          <Text variant="subtitle" color="neutral.c80">
            <Trans i18nKey="v3.receive.steps.receiveFunds.qrCode" />
          </Text>
          <Button.Expand onToggle={setShowQrCode} p="0 !important">
            <Trans i18nKey="v3.receive.steps.receiveFunds.showQrCode" />
          </Button.Expand>
        </Flex>
        {showQrCode && (
          <Flex justifyContent="center">
            <Box p={4} border="1px solid" borderColor="neutral.c40" borderRadius={1}>
              <QRCode size={160} data={address} />
            </Box>
          </Flex>
        )}
      </Flex>
      <Alert
        type="info"
        renderContent={() => (
          <Text variant="paragraph" color="inherit">
            <Trans i18nKey="v3.receive.steps.receiveFunds.messageIfUnverified" />
          </Text>
        )}
      />
    </Flex>
  );
}

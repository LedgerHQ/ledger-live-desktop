import React, { useState } from "react";
import { Trans } from "react-i18next";
import { useTheme } from "styled-components";
import { Box, Flex, Link, Log, Text, Divider, Button, Alert } from "@ledgerhq/react-ui";
import { rgba } from "@ledgerhq/react-ui/styles";
import { Account, AccountLike, TokenCurrency } from "@ledgerhq/live-common/lib/types";
import { getAccountName, getMainAccount } from "@ledgerhq/live-common/lib/account";
import { FinalStepIllustration } from "./FinalStepIllustration";
import { openURL } from "~/renderer/linking";
import { urls } from "~/config/urls";
import ReadOnlyAddressField from "~/renderer/components/ReadOnlyAddressField";
import QRCode from "~/renderer/components/QRCode";

type Props = {
  account?: AccountLike;
  token?: TokenCurrency;
  parentAccount?: Account;
  isAddressVerified?: boolean;
};

export function FinalStepShareAddress({ account, token, parentAccount, isAddressVerified }: Props) {
  const theme = useTheme();
  const [showQrCode, setShowQrCode] = useState(false);
  const name = token ? token.name : account ? getAccountName(account) : "";
  const mainAccount = account ? getMainAccount(account, parentAccount) : null;
  if (!account || !mainAccount) {
    throw new Error("No account given");
  }
  const address = mainAccount.freshAddress;

  return (
    <Flex flexDirection="column" justifyContent="center" flex={1} bg="success.c100" rowGap={12}>
      <Flex
        flexDirection="column"
        rowGap={8}
        alignSelf="stretch"
        justifyContent="center"
        alignItems="center"
      >
        <Box width="70%">
          <FinalStepIllustration />
        </Box>
        <Log extraTextProps={{ variant: "h5" }} width="60%">
          <Trans
            i18nKey={
              isAddressVerified
                ? "v3.receive.successTitle"
                : "v3.receive.successTitleNoVerification"
            }
          />
        </Log>
        <Text>
          <Trans i18nKey="v3.currentAddress.for">
            <Text fontWeight="600">{name}</Text>
          </Trans>
        </Text>
      </Flex>
      <Flex flexDirection="column" rowGap={2} p={12}>
        <Flex alignItems="center" justifyContent="space-between" mb={5}>
          <Text variant="subtitle">
            <Trans i18nKey="v3.receive.steps.receiveFunds.address" />
          </Text>
          <ReadOnlyAddressField
            address={address}
            extraCopyContainerProps={{ color: "neutral.c100" }}
          />
        </Flex>
        <Divider variant="default" />
        <Flex alignItems="center" justifyContent="space-between">
          <Text variant="subtitle">
            <Trans i18nKey="v3.receive.steps.receiveFunds.qrCode" />
          </Text>
          <Button.Expand onToggle={setShowQrCode} p="0 !important">
            <Trans i18nKey="v3.receive.steps.receiveFunds.showQrCode" />
          </Button.Expand>
        </Flex>
        {showQrCode && (
          <Flex justifyContent="center">
            <Box p={4} border="1px solid" borderColor="neutral.c100" borderRadius={1}>
              <QRCode size={160} data={address} />
            </Box>
          </Flex>
        )}
        {!isAddressVerified && (
          <Alert
            type="info"
            containerProps={{
              bg: rgba(theme.colors.neutral.c100, 0.12),
              color: "neutral.c100",
              mt: 8,
            }}
            renderContent={() => (
              <Flex flexDirection="column" alignItems="flex-start">
                <Text variant="paragraph" color="inherit">
                  <Trans i18nKey="currentAddress.messageIfSkipped" values={{ name }} />
                </Text>
                <Link onClick={() => openURL(urls.recipientAddressInfo)} alwaysUnderline>
                  <Trans i18nKey="common.learnMore" />
                </Link>
              </Flex>
            )}
          />
        )}
      </Flex>
    </Flex>
  );
}

type VerifiedFooterProps = {
  onReverify: () => void;
  onDone: () => void;
};

function VerifiedFooter({ onReverify, onDone }: VerifiedFooterProps) {
  return (
    <>
      <Button onClick={onReverify} variant="main" outline>
        <Trans i18nKey="common.reverify" />
      </Button>
      <Button onClick={onDone} variant="main">
        <Trans i18nKey="common.done" />
      </Button>
    </>
  );
}

type UnverifiedFooterProps = {
  onCancel: () => void;
  onVerify: () => void;
};

function UnverifiedFooter({ onCancel, onVerify }: UnverifiedFooterProps) {
  return (
    <>
      <Button onClick={onCancel} variant="main" outline>
        <Trans i18nKey="common.cancel" />
      </Button>
      <Button onClick={onVerify} variant="main">
        <Trans i18nKey="common.verifyMyAddress" />
      </Button>
    </>
  );
}

FinalStepShareAddress.VerifiedFooter = VerifiedFooter;
FinalStepShareAddress.UnverifiedFooter = UnverifiedFooter;

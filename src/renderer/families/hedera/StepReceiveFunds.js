// @flow

import React, { useRef, useCallback, useState } from "react";
import { Trans } from "react-i18next";
import invariant from "invariant";
import { getMainAccount, getAccountName } from "@ledgerhq/live-common/lib/account";
import styled from "styled-components";

import TrackPage from "~/renderer/analytics/TrackPage";
import useTheme from "~/renderer/hooks/useTheme";
import { openURL } from "~/renderer/linking";
import Box from "~/renderer/components/Box";
import ErrorDisplay from "~/renderer/components/ErrorDisplay";
import Text from "~/renderer/components/Text";
import Ellipsis from "~/renderer/components/Ellipsis";
import ReadOnlyAddressField from "~/renderer/components/ReadOnlyAddressField";
import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";
import LinkShowQRCode from "~/renderer/components/LinkShowQRCode";
import { renderVerifyUnwrapped } from "~/renderer/components/DeviceAction/rendering";
import Modal from "~/renderer/components/Modal";
import ModalBody from "~/renderer/components/Modal/ModalBody";
import Alert from "~/renderer/components/Alert";
import QRCode from "~/renderer/components/QRCode";
import AccountTagDerivationMode from "~/renderer/components/AccountTagDerivationMode";
import { urls } from "~/config/urls";

import type { StepProps } from "~/renderer/modals/Receive/Body";
import type { AccountLike } from "@ledgerhq/live-common/lib/types";

const Separator = styled.div`
  border-top: 1px solid #99999933;
  margin: 50px 0;
`;
const Separator2 = styled.div`
  border-top: 1px solid #99999933;
  margin-top: 50px;
`;

const QRCodeWrapper = styled.div`
  border: 24px solid white;
  height: 208px;
  width: 208px;
  background: white;
`;

const AlertBoxContainer = styled.div`
  margin-top: 20px;
`;

const Receive1ShareAddress = ({
  account,
  name,
  address,
  showQRCodeModal,
}: {
  account: AccountLike,
  name: string,
  address: string,
  showQRCodeModal: () => void,
}) => {
  return (
    <>
      <Box horizontal alignItems="center" flow={2} mb={4}>
        <Text style={{ flex: 1 }} ff="Inter|SemiBold" color="palette.text.shade100" fontSize={4}>
          {name ? (
            <Box horizontal alignItems="center" flexWrap="wrap">
              <Ellipsis>
                <Trans i18nKey="currentAddress.for">
                  {"Address for "}
                  <strong>{name}</strong>
                </Trans>
              </Ellipsis>
              <AccountTagDerivationMode account={account} />
            </Box>
          ) : (
            <Trans i18nKey="currentAddress.title" />
          )}
        </Text>
        <LinkShowQRCode onClick={showQRCodeModal} address={address} />
      </Box>
      <ReadOnlyAddressField address={address} />
    </>
  );
};

const Receive2Device = ({
  onVerify,
  name,
  device,
}: {
  onVerify: () => void,
  name: string,
  device: *,
}) => {
  const type = useTheme("colors.palette.type");

  return (
    <>
      <Box horizontal alignItems="center" flow={2}>
        <Text
          style={{ flexShrink: "unset" }}
          ff="Inter|SemiBold"
          color="palette.text.shade100"
          fontSize={4}
        >
          <span style={{ marginRight: 10 }}>
            <Trans i18nKey="currentAddress.messageIfUnverified" value={{ name }} />
          </span>
          <LinkWithExternalIcon
            style={{ display: "inline-flex" }}
            onClick={() => openURL(urls.recipientAddressInfo)}
            label={<Trans i18nKey="common.learnMore" />}
          />
        </Text>
      </Box>

      {renderVerifyUnwrapped({ modelId: device.modelId, type })}
    </>
  );
};

const StepReceiveFunds = ({
  isAddressVerified,
  account,
  parentAccount,
  device,
  onChangeAddressVerified,
  transitionTo,
  onResetSkip,
  verifyAddressError,
  token,
  onClose,
  eventType,
  currencyName,
}: StepProps) => {
  const mainAccount = account ? getMainAccount(account, parentAccount) : null;
  invariant(account && mainAccount, "No account given");
  const name = token ? token.name : getAccountName(account);
  const initialDevice = useRef(device);
  const address = mainAccount.hederaResources?.accountId?.toString() ?? mainAccount.freshAddress;
  const [modalVisible, setModalVisible] = useState(false);

  const hideQRCodeModal = useCallback(() => setModalVisible(false), [setModalVisible]);
  const showQRCodeModal = useCallback(() => setModalVisible(true), [setModalVisible]);

  const onVerify = useCallback(() => {
    // if device has changed since the beginning, we need to re-entry device
    if (device !== initialDevice.current || !isAddressVerified) {
      transitionTo("device");
    }
    onChangeAddressVerified(null);
    onResetSkip();
  });

  return (
    <>
      <Box px={2}>
        <TrackPage
          category={`Receive Flow${eventType ? ` (${eventType})` : ""}`}
          name="Step 3"
          currencyName={currencyName}
        />
        {verifyAddressError ? (
          <ErrorDisplay error={verifyAddressError} onRetry={onVerify} />
        ) : device ? (
          // verification with device
          <>
            <Receive1ShareAddress
              account={mainAccount}
              name={name}
              address={address}
              showQRCodeModal={showQRCodeModal}
            />

            {/* show warning for unverified address */}
            <Alert type="security" mt={4}>
              <Trans i18nKey="hedera.currentAddress.messageIfVirtual" values={{ name }} />
            </Alert>
          </>
        ) : null // should not happen
        }
      </Box>

      <Modal isOpened={modalVisible} onClose={hideQRCodeModal} centered width={460}>
        <ModalBody
          onClose={hideQRCodeModal}
          render={() => (
            <Box alignItems="center">
              <QRCodeWrapper>
                <QRCode size={160} data={address} />
              </QRCodeWrapper>
              <Box mt={6}>
                <ReadOnlyAddressField address={address} />
              </Box>
            </Box>
          )}
        />
      </Modal>
    </>
  );
};

export default StepReceiveFunds;

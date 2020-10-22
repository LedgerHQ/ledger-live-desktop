// @flow

import React from "react";
import { Trans } from "react-i18next";
import { urls } from "~/config/urls";
import { openURL } from "~/renderer/linking";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import Text from "~/renderer/components/Text";
import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";
import IconShield from "~/renderer/icons/Shield";

const Receive2NoDevice = ({ onVerify, name }: { onVerify: Function, name: string }) => {
  return (
    <>
      <Box horizontal flow={2} mt={2} alignItems="center">
        <Box color="alertRed">
          <IconShield height={32} width={28} />
        </Box>
        <Text fontSize={12} color="alertRed" ff="Inter" style={{ flexShrink: "unset" }}>
          <span style={{ marginRight: 10 }}>
            <Trans i18nKey="currentAddress.messageIfSkipped" values={{ name }} />
          </span>
          <LinkWithExternalIcon
            style={{ display: "inline-flex" }}
            onClick={() => openURL(urls.recipientAddressInfo)}
            label={<Trans i18nKey="common.learnMore" />}
          />
        </Text>
      </Box>

      <Box pt={4} horizontal justifyContent="center">
        <Button primary onClick={onVerify}>
          <Trans i18nKey="common.verify" />
        </Button>
      </Box>
    </>
  );
};

export default Receive2NoDevice;

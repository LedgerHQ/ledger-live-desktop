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

const Receive2NoDevice = ({
  onVerify,
  onContinue,
  name,
}: {
  onVerify: Function,
  onContinue?: Function,
  name: string,
}) => {
  const m = onVerify && onContinue ? 8 : 0;
  return (
    <>
      <Box style={{ width: "100%" }} pt={4} horizontal justifyContent="flex-end">
        {onVerify ? (
          <Button outlineGrey onClick={onVerify}>
            <Trans i18nKey="common.verify" />
          </Button>
        ) : null}
        {onContinue ? (
          <Button ml={1} primary onClick={onContinue}>
            <Trans i18nKey="common.continue" />
          </Button>
        ) : null}
      </Box>
    </>
  );
};

export default Receive2NoDevice;

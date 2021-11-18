// @flow
import React from "react";
import Box from "~/renderer/components/Box";
import type { FooterProps } from "./types";
import Button from "~/renderer/components/Button";
import { STATUS } from "~/renderer/screens/WalletConnect/Provider";
import { Trans } from "react-i18next";

const Footer = ({ onContinue, onReject, wcDappName, wcStatus }: FooterProps) => {
  return (
    <Box horizontal justifyContent="flex-end">
      {wcStatus === STATUS.CONNECTING && wcDappName ? (
        <Button onClick={onReject} outline>
          <Trans i18nKey="common.reject" />
        </Button>
      ) : null}
      <Box style={{ width: 10 }} />
      <Button
        onClick={onContinue}
        primary
        disabled={!(wcStatus === STATUS.CONNECTING && wcDappName)}
        id="wc-paste-link-confirm-continue"
      >
        <Trans i18nKey="common.continue" />
      </Button>
    </Box>
  );
};

export default Footer;

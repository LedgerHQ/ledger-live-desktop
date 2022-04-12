// @flow
import React from "react";
import Box from "~/renderer/components/Box";
import type { FooterProps } from "./types";
import Button from "~/renderer/components/Button";
import { STATUS } from "~/renderer/screens/WalletConnect/Provider";
import { useTranslation } from "react-i18next";

const Footer = ({ onContinue, onReject, onCancel, wcDappName, wcStatus, account }: FooterProps) => {
  const { t } = useTranslation();

  return (
    <Box horizontal justifyContent="flex-end">
      {wcStatus === STATUS.CONNECTING && wcDappName ? (
        <>
          <Button onClick={onReject} outline>
            {t("common.reject")}
          </Button>
          <Box style={{ width: 10 }} />
          <Button
            onClick={onContinue}
            primary
            disabled={!account}
            id="wc-deep-link-confirm-continue"
          >
            {t("common.continue")}
          </Button>
        </>
      ) : wcStatus === STATUS.CONNECTED ? (
        <>
          <Button onClick={onCancel} outline>
            {t("common.cancel")}
          </Button>
          <Box style={{ width: 10 }} />
          <Button onClick={onReject} primary id="wc-deep-link-confirm-disconnect">
            {t("walletconnect.disconnect")}
          </Button>
        </>
      ) : null}
    </Box>
  );
};

export default Footer;

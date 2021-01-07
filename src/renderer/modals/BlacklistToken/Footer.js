// @flow

import React, { useCallback } from "react";
import Button from "~/renderer/components/Button";
import { Trans } from "react-i18next";
import Box from "~/renderer/components/Box";
import { useDispatch } from "react-redux";
import { blacklistToken } from "~/renderer/actions/settings";
import type { TokenCurrency } from "@ledgerhq/live-common/lib/types";

const Footer = ({ onClose, token }: { onClose: () => void, token: TokenCurrency }) => {
  const dispatch = useDispatch();
  const confirmBlacklistToken = useCallback(
    tokenId => {
      dispatch(blacklistToken(tokenId));
    },
    [dispatch],
  );

  return (
    <Box horizontal alignItems="center" justifyContent="flex-end" flow={2}>
      <Button onClick={onClose}>
        <Trans i18nKey="common.cancel" />
      </Button>
      <Button
        onClick={() => {
          confirmBlacklistToken(token.id);
          onClose();
        }}
        primary
      >
        <Trans i18nKey="blacklistToken.hideCTA" />
      </Button>
    </Box>
  );
};

export default Footer;

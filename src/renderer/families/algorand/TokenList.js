// @flow
import React from "react";
import { Trans } from "react-i18next";

import type { Account } from "@ledgerhq/live-common/lib/types/account";

import Box from "~/renderer/components/Box";
import IconPlus from "~/renderer/icons/Plus";
import Button from "~/renderer/components/Button";

const ReceiveButton = ({
  openModal,
  account,
}: {
  openModal: (modal: string, params?: *) => void,
  account: Account,
}) => {
  const onReceiveClick = () => {
    openModal("MODAL_ALGORAND_OPT_IN", { account });
  };
  return (
    <Button small primary onClick={onReceiveClick}>
      <Box horizontal flow={1} alignItems="center">
        <IconPlus size={12} />
        <Box>
          <Trans i18nKey="tokensList.algorand.cta" />
        </Box>
      </Box>
    </Button>
  );
};

export default {
  ReceiveButton,
  hasSpecificTokenWording: true,
};

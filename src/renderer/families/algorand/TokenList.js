// @flow
import React from "react";
import { Trans } from "react-i18next";
import { useDispatch } from "react-redux";
import type { Account } from "@ledgerhq/live-common/lib/types/account";

import { openModal } from "~/renderer/actions/modals";

import Box from "~/renderer/components/Box";
import IconPlus from "~/renderer/icons/Plus";
import Button from "~/renderer/components/Button";

const ReceiveButton = ({ account }: { account: Account }) => {
  const dispatch = useDispatch();
  const onReceiveClick = () => {
    dispatch(openModal("MODAL_ALGORAND_OPT_IN", { account }));
  };
  return (
    <Button small color="palette.primary.main" onClick={onReceiveClick}>
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

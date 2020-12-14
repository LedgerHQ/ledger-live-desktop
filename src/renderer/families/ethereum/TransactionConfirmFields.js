// @flow

import invariant from "invariant";
import React from "react";
import { Trans } from "react-i18next";

import type { Transaction } from "@ledgerhq/live-common/lib/types";

import WarnBox from "~/renderer/components/WarnBox";

const Warning = ({
  transaction,
  recipientWording,
}: {
  transaction: Transaction,
  recipientWording: string,
}) => {
  invariant(transaction.family === "ethereum", "ethereum transaction");

  switch (transaction.mode) {
    case "compound.withdraw":
    case "compound.supply":
    case "erc20.approve":
      return (
        <WarnBox>
          <Trans i18nKey="TransactionConfirm.secureContract" />
        </WarnBox>
      );
    default:
      return (
        <WarnBox>
          <Trans i18nKey="TransactionConfirm.warning" values={{ recipientWording }} />
        </WarnBox>
      );
  }
};

export default {
  warning: Warning,
};

// @flow

import invariant from "invariant";
import React from "react";
import { Trans, withTranslation } from "react-i18next";
import type { Account, Transaction } from "@ledgerhq/live-common/lib/types";
import { shortAddressPreview } from "@ledgerhq/live-common/lib/account";
import TransactionConfirmField from "~/renderer/components/TransactionConfirm/TransactionConfirmField";
import Text from "~/renderer/components/Text";

const addressStyle = {
  wordBreak: "break-all",
  textAlign: "right",
  maxWidth: "70%",
};

const Post = ({ account, transaction }: { account: Account, transaction: Transaction }) => {
  invariant(transaction.family === "stellar", "stellar transaction");

  return (
    <>
      <TransactionConfirmField
        label={
          <Trans
            i18nKey={`send.steps.details.stellarMemoType.${
              transaction.memoType ? transaction.memoType : "NO_MEMO"
            }`}
          />
        }
      >
        <Text
          style={addressStyle}
          ml={1}
          ff="Inter|Medium"
          color="palette.text.shade80"
          fontSize={3}
        >
          {transaction.memoValue ? `${transaction.memoValue} ` : "[none]"}
        </Text>
      </TransactionConfirmField>
      <TransactionConfirmField label={<Trans i18nKey="send.steps.details.stellarNetwork" />}>
        <Text ff="Inter|Medium" color="palette.text.shade80" fontSize={3}>
          <Trans i18nKey="send.steps.details.stellarNetworkPublic" />
        </Text>
      </TransactionConfirmField>
      <TransactionConfirmField label={<Trans i18nKey="send.steps.details.stellarSource" />}>
        <Text
          style={addressStyle}
          ml={1}
          ff="Inter|Medium"
          color="palette.text.shade80"
          fontSize={3}
        >
          {shortAddressPreview(account.freshAddress, 16)}
        </Text>
      </TransactionConfirmField>
    </>
  );
};

export default {
  post: withTranslation()(Post),
};

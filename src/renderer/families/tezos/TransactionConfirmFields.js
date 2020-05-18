// @flow

import invariant from "invariant";
import React, { useCallback } from "react";
import { useBaker } from "@ledgerhq/live-common/lib/families/tezos/bakers";
import { shortAddressPreview, getMainAccount } from "@ledgerhq/live-common/lib/account";
import { getDefaultExplorerView, getAddressExplorer } from "@ledgerhq/live-common/lib/explorers";
import { openURL } from "~/renderer/linking";
import TransactionConfirmField from "~/renderer/components/TransactionConfirm/TransactionConfirmField";
import Text from "~/renderer/components/Text";
import type { FieldComponentProps } from "~/renderer/components/TransactionConfirm";

const TezosDelegateValidator = ({
  account,
  parentAccount,
  transaction,
  field,
}: FieldComponentProps) => {
  invariant(transaction.family === "tezos", "tezos transaction");

  const mainAccount = getMainAccount(account, parentAccount);
  const baker = useBaker(transaction.recipient);
  const explorerView = getDefaultExplorerView(mainAccount.currency);
  const bakerURL = getAddressExplorer(explorerView, transaction.recipient);
  const openBaker = useCallback(() => {
    if (bakerURL) openURL(bakerURL);
  }, [bakerURL]);

  return (
    <TransactionConfirmField label={field.label}>
      <Text onClick={openBaker} color="palette.primary.main" ml={1} ff="Inter|Medium" fontSize={3}>
        {baker ? baker.name : shortAddressPreview(transaction.recipient)}
      </Text>
    </TransactionConfirmField>
  );
};

const TezosStorageLimit = ({ transaction, field }: FieldComponentProps) => {
  invariant(transaction.family === "tezos", "tezos transaction");

  return (
    <TransactionConfirmField label={field.label}>
      <Text ff="Inter|Medium" color="palette.text.shade80" fontSize={3}>
        {(transaction.storageLimit || "").toString()}
      </Text>
    </TransactionConfirmField>
  );
};

const fieldComponents = {
  "tezos.delegateValidator": TezosDelegateValidator,
  "tezos.storageLimit": TezosStorageLimit,
};

export default {
  fieldComponents,
};

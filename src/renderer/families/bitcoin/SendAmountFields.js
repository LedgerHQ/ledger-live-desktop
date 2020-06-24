// @flow

import invariant from "invariant";
import React, { useState, useCallback } from "react";
import { Trans, withTranslation } from "react-i18next";
import type { Account, Transaction, TransactionStatus } from "@ledgerhq/live-common/lib/types";
import Box from "~/renderer/components/Box";
import GenericContainer from "~/renderer/components/FeesContainer";
import Spoiler from "~/renderer/components/Spoiler";
import Button from "~/renderer/components/Button";
import KeyboardContent from "~/renderer/components/KeyboardContent";
import CoinControlModal from "./CoinControlModal";
import { FeesField } from "./FeesField";
import { PickUnconfirmedRBF } from "./PickUnconfirmedRBF";

type Props = {
  account: Account,
  transaction: Transaction,
  onChange: Transaction => void,
  status: TransactionStatus,
};

const Fields = ({ transaction, account, onChange, status }: Props) => {
  invariant(transaction.family === "bitcoin", "FeeField: bitcoin family expected");

  const [coinControlOpened, setCoinControlOpened] = useState(false);
  const onCoinControlOpen = useCallback(() => setCoinControlOpened(true), []);
  const onCoinControlClose = useCallback(() => setCoinControlOpened(false), []);

  return (
    <GenericContainer>
      <FeesField transaction={transaction} account={account} onChange={onChange} status={status} />
      <Box mt={4} flow={2}>
        <Spoiler textTransform title={<Trans i18nKey="bitcoin.advanced" />}>
          <Box horizontal alignItems="center">
            <PickUnconfirmedRBF
              transaction={transaction}
              account={account}
              onChange={onChange}
              status={status}
            />
            <Box grow />
            <KeyboardContent sequence="coincontrol">
              <Box horizontal alignItems="center">
                <Button onClick={onCoinControlOpen}>Coin Control</Button>
              </Box>
            </KeyboardContent>
          </Box>
          <CoinControlModal
            transaction={transaction}
            account={account}
            onChange={onChange}
            status={status}
            isOpened={coinControlOpened}
            onClose={onCoinControlClose}
          />
        </Spoiler>
      </Box>
    </GenericContainer>
  );
};

export default {
  component: withTranslation()(Fields),
  fields: ["feePerByte", "rbf"],
};

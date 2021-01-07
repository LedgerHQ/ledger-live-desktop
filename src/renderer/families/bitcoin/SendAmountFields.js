// @flow

import invariant from "invariant";
import React, { useState, useCallback, useEffect } from "react";
import { Trans, withTranslation } from "react-i18next";
import styled from "styled-components";
import type { Account, Transaction, TransactionStatus } from "@ledgerhq/live-common/lib/types";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import GenericContainer from "~/renderer/components/FeesContainer";
import Spoiler from "~/renderer/components/Spoiler";
import Button from "~/renderer/components/Button";
import Tooltip from "~/renderer/components/Tooltip";
import CoinControlModal from "./CoinControlModal";
import { FeesField } from "./FeesField";
import { PickUnconfirmedRBF } from "./PickUnconfirmedRBF";
import { RBF } from "./RBF";
import useBitcoinPickingStrategy from "./useBitcoinPickingStrategy";

type Props = {
  account: Account,
  transaction: Transaction,
  onChange: Transaction => void,
  status: TransactionStatus,
  bridgePending: boolean,
  updateTransaction: (updater: any) => void,
};

const Separator = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${p => p.theme.colors.palette.text.shade10};
  margin: 20px 0;
`;

const InputBox = styled(Box)`
  margin-top: 0;
  & > * > * {
    margin-bottom: 12px;
  }
`;

const Fields = ({
  transaction,
  account,
  onChange,
  status,
  bridgePending,
  updateTransaction,
}: Props) => {
  invariant(transaction.family === "bitcoin", "FeeField: bitcoin family expected");

  const bridge = getAccountBridge(account);

  const [coinControlOpened, setCoinControlOpened] = useState(false);
  const onCoinControlOpen = useCallback(() => setCoinControlOpened(true), []);
  const onCoinControlClose = useCallback(() => setCoinControlOpened(false), []);
  const { item } = useBitcoinPickingStrategy(transaction.utxoStrategy.strategy);
  const canNext = account.bitcoinResources?.utxos?.length;

  /* TODO: How do we set default RBF to be true ? (@gre)
   * Meanwhile, using this trick (please don't kill me)
   */
  useEffect(() => {
    updateTransaction(t => bridge.updateTransaction(t, { rbf: true }));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <GenericContainer>
      <FeesField transaction={transaction} account={account} onChange={onChange} status={status} />
      <Box mt={4} flow={2}>
        <Spoiler textTransform title={<Trans i18nKey="bitcoin.advanced" />}>
          <Box horizontal alignItems="center">
            <Box>
              <Text ff="Inter|Regular" fontSize={12} color="palette.text.shade50">
                <Trans i18nKey="bitcoin.strategy" />
              </Text>
              <Text ff="Inter|Regular" fontSize={13} color="palette.text.shade100">
                {item ? item.label : null}
              </Text>
            </Box>
            <Box grow />
            <Box horizontal alignItems="center">
              {canNext ? (
                <Button secondary onClick={onCoinControlOpen} disabled={!canNext}>
                  <Trans i18nKey="bitcoin.coincontrol" />
                </Button>
              ) : (
                <Tooltip content={<Trans i18nKey="bitcoin.ctaDisabled" />}>
                  <Button secondary onClick={onCoinControlOpen} disabled={!canNext}>
                    <Trans i18nKey="bitcoin.coincontrol" />
                  </Button>
                </Tooltip>
              )}
            </Box>
          </Box>
          <Separator />
          <InputBox>
            <RBF transaction={transaction} account={account} onChange={onChange} status={status} />
            <PickUnconfirmedRBF
              transaction={transaction}
              account={account}
              onChange={onChange}
              status={status}
            />
          </InputBox>
          <CoinControlModal
            transaction={transaction}
            account={account}
            onChange={onChange}
            status={status}
            isOpened={coinControlOpened}
            onClose={onCoinControlClose}
            updateTransaction={updateTransaction}
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

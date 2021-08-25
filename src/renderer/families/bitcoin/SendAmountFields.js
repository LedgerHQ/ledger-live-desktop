// @flow

import invariant from "invariant";
import React, { useState, useCallback, useEffect } from "react";
import { Trans, withTranslation } from "react-i18next";
import styled from "styled-components";
import type {
  Account,
  Transaction,
  TransactionStatus,
  FeeStrategy,
} from "@ledgerhq/live-common/lib/types";
import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import Tooltip from "~/renderer/components/Tooltip";
import SelectFeeStrategy from "~/renderer/components/SelectFeeStrategy";
import CoinControlModal from "./CoinControlModal";
import { FeesField } from "./FeesField";
import { PickUnconfirmedRBF } from "./PickUnconfirmedRBF";
import { RBF } from "./RBF";
import useBitcoinPickingStrategy from "./useBitcoinPickingStrategy";
import { useFeesStrategy } from "@ledgerhq/live-common/lib/families/bitcoin/react";
import SendFeeMode from "~/renderer/components/SendFeeMode";

type Props = {
  account: Account,
  parentAccount: ?Account,
  transaction: Transaction,
  onChange: Transaction => void,
  status: TransactionStatus,
  bridgePending: boolean,
  updateTransaction: (updater: any) => void,
  mapStrategies?: FeeStrategy => FeeStrategy & { [string]: * },
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
  parentAccount,
  onChange,
  status,
  updateTransaction,
  mapStrategies,
}: Props) => {
  invariant(transaction.family === "bitcoin", "FeeField: bitcoin family expected");

  const bridge = getAccountBridge(account);

  const [coinControlOpened, setCoinControlOpened] = useState(false);
  const [isAdvanceMode, setAdvanceMode] = useState(!transaction.feesStrategy);
  const strategies = useFeesStrategy(account, transaction);
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

  const onFeeStrategyClick = useCallback(
    ({ amount, feesStrategy }) => {
      updateTransaction(transaction =>
        bridge.updateTransaction(transaction, { feePerByte: amount, feesStrategy }),
      );
    },
    [updateTransaction, bridge],
  );

  return (
    <>
      <SendFeeMode isAdvanceMode={isAdvanceMode} setAdvanceMode={setAdvanceMode} />
      {isAdvanceMode ? (
        <Box>
          <FeesField
            transaction={transaction}
            account={account}
            onChange={onChange}
            status={status}
          />
          <Separator />
          <Box flow={2}>
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
              <RBF
                transaction={transaction}
                account={account}
                onChange={onChange}
                status={status}
              />
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
          </Box>
        </Box>
      ) : (
        <SelectFeeStrategy
          strategies={strategies}
          onClick={onFeeStrategyClick}
          transaction={transaction}
          account={account}
          parentAccount={parentAccount}
          suffixPerByte={true}
          mapStrategies={mapStrategies}
        />
      )}
    </>
  );
};

export default {
  component: withTranslation()(Fields),
  fields: ["feePerByte", "rbf"],
};

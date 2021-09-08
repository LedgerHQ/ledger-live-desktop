// @flow
import React, { useState, useMemo, useCallback } from "react";
import { Trans } from "react-i18next";
import styled from "styled-components";
import { useDispatch } from "react-redux";
import { getMainAccount } from "@ledgerhq/live-common/lib/account/helpers";
import { addPendingOperation } from "@ledgerhq/live-common/lib/account";
import addToSwapHistory from "@ledgerhq/live-common/lib/exchange/swap/addToSwapHistory";
import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import SwapAction from "./SwapAction";
import type { SwapTransactionType } from "~/renderer/screens/exchange/Swap2/utils/shared/useSwapTransaction";
import type { ExchangeRate } from "@ledgerhq/live-common/lib/exchange/swap/types";
import ErrorDisplay from "~/renderer/components/ErrorDisplay";
import {
  Header as DeviceActionHeader,
  Footer as DeviceActionFooter,
} from "~/renderer/components/DeviceAction/rendering";
import { updateAccountWithUpdater } from "~/renderer/actions/accounts";
import SwapCompleted from "./SwapCompleted";
import Button from "~/renderer/components/Button";
import { setDrawer } from "~/renderer/drawers/Provider";
import { useRedirectToSwapHistory } from "../../utils/index";

const Separator = styled.div`
  border-top: 1px solid ${p => p.theme.colors.palette.divider};
  ${p => (p.noMargin ? "" : "margin-top: 24px; margin-bottom: 24px;")}
`;

const ContentBox = styled(Box)`
  ${DeviceActionHeader} {
    flex: 0;
  }
  ${DeviceActionFooter} {
    flex: 0;
  }
`;

type Props = {
  swapTransaction: SwapTransactionType,
  exchangeRate: ExchangeRate,
  onCompleteSwap?: () => void,
};
export default function ExchangeDrawer({ swapTransaction, exchangeRate, onCompleteSwap }: Props) {
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const redirectToHistory = useRedirectToSwapHistory();
  const {
    transaction,
    swap: {
      from: { account: fromAccount, parentAccount: fromParentAccount },
      to: { account: toAccount, parentAccount: toParentAccount, currency: targetCurrency },
    },
  } = swapTransaction;
  const exchange = useMemo(
    () => ({
      fromParentAccount,
      fromAccount,
      toParentAccount,
      toAccount,
    }),
    [fromAccount, fromParentAccount, toAccount, toParentAccount],
  );

  const onCompletion = useCallback(
    result => {
      const { operation, swapId } = result;
      const mainAccount = getMainAccount(exchange.fromAccount, exchange.fromParentAccount);

      if (!mainAccount) return;
      const accountUpdater = account => {
        const accountWithUpdatedHistory = addToSwapHistory({
          account,
          operation,
          transaction,
          swap: {
            exchange,
            exchangeRate,
          },
          swapId,
        });
        return addPendingOperation(accountWithUpdatedHistory, operation);
      };
      const dispatchAction = updateAccountWithUpdater(mainAccount.id, accountUpdater);
      dispatch(dispatchAction);
      setResult(result);
      onCompleteSwap && onCompleteSwap();
    },
    [dispatch, exchange, exchangeRate, onCompleteSwap, transaction],
  );

  const onViewDetails = useCallback(
    () => {
      if (!result) return;
      const { operation } = result;
      const concernedOperation = operation
        ? operation.subOperations && operation.subOperations.length > 0
          ? operation.subOperations[0]
          : operation
        : null;

      if (fromAccount && concernedOperation) {
        redirectToHistory({ swapId: result?.swapId });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fromAccount, fromParentAccount, result?.operation],
  );

  const closeDrawer = useCallback(_ => setDrawer(), []);

  if (error) {
    return (
      <Box height="100%" justifyContent="space-between">
        <Box justifyContent="center" flex={1}>
          <ErrorDisplay error={error} />
        </Box>
        <Box flex={0}>
          <Separator noMargin />
          <Box style={{ flexDirection: "row-reverse" }} px={24} pt={16}>
            <Button primary onClick={closeDrawer}>
              <Trans i18nKey="common.retry" />
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

  if (result) {
    return (
      <Box height="100%" justifyContent="space-between">
        <Box justifyContent="center" flex={1}>
          <SwapCompleted
            swapId="122144134"
            provider={exchangeRate.provider}
            targetCurrency={targetCurrency.name}
          />
        </Box>
        <Box flex={0}>
          <Separator noMargin />
          <Box style={{ flexDirection: "row-reverse" }} px={24} pt={16}>
            <Button primary onClick={onViewDetails}>
              <Trans i18nKey="swap2.exchangeDrawer.completed.seeDetails" />
            </Button>
          </Box>
        </Box>
      </Box>
    );
  }

  return (
    <Box height="100%">
      <Box horizontal justifyContent="center">
        <Text fontSize={6} ff="Inter|SemiBold" textTransform="capitalize">
          <Trans i18nKey="swap2.exchangeDrawer.title" />
        </Text>
      </Box>
      <Separator />
      <ContentBox flex={1} justifyContent="center">
        <SwapAction
          swapTransaction={swapTransaction}
          exchangeRate={exchangeRate}
          onCompletion={onCompletion}
          onError={setError}
        />
      </ContentBox>
    </Box>
  );
}

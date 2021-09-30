import React, { useCallback } from "react";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import { MarketCounterValueSelect } from "~/renderer/screens/market/MarketCounterValueSelect";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";
import { accountSelector } from "~/renderer/reducers/accounts";
import { findSubAccountById } from "@ledgerhq/live-common/lib/account";
import { countervalueFirstSelector } from "~/renderer/reducers/settings";
import connect, { useSelector } from "react-redux";
import { setTrackingSource } from "~/renderer/analytics/TrackPage";
import { useHistory } from "react-router";

function CryptocurrencyHeaderActions({ currency }) {
  const state = useSelector(state => state);
  const history = useHistory();

  const onBuy = useCallback(() => {
    setTrackingSource("cryptocurrency header actions");
    history.push({
      pathname: "/exchange",
      state: {
        defaultCurrency: currency,
      },
    });
  }, [currency, history]);

  const onSwap = useCallback(() => {
    setTrackingSource("cryptocurrency header actions");
    history.push({
      pathname: "/swap",
      state: {
        defaultCurrency: currency,
      },
    });
  }, [currency, history]);

  return (
    <Box horizontal alignItems="center">
      <Box mr={12}>
        <MarketCounterValueSelect />
      </Box>
      <Box mr={12}>
        <Button primary onClick={onBuy}>
          Buy
        </Button>
      </Box>
      <Box mr={12}>
        <Button primary onClick={onSwap}>
          Swap
        </Button>
      </Box>
    </Box>
  );
}

// const mapStateToProps = (
//   state,
//   {
//     match: {
//       params: { id, parentId },
//     },
//   },
// ) => {
//   const parentAccount: ?Account = parentId && accountSelector(state, { accountId: parentId });
//   let account: ?AccountLike;
//   if (parentAccount) {
//     account = findSubAccountById(parentAccount, id);
//   } else {
//     account = accountSelector(state, { accountId: id });
//   }
//   return {
//     parentAccount,
//     account,
//     countervalueFirst: countervalueFirstSelector(state),
//   };
// };

export default CryptocurrencyHeaderActions;

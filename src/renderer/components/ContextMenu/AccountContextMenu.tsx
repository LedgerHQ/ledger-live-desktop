import React, { useContext, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Account, AccountLike } from "@ledgerhq/live-common/lib/types/account";
import { getAccountCurrency, getMainAccount } from "@ledgerhq/live-common/lib/account/helpers";
import { Icons, Text } from "@ledgerhq/react-ui";
import { openModal } from "~/renderer/actions/modals";
import ContextMenuItem from "./ContextMenuItem";
import { ContextMenuItemType } from "./ContextMenuWrapper";
import { useRefreshAccountsOrdering } from "~/renderer/actions/general";
import { swapSelectableCurrenciesSelector } from "~/renderer/reducers/settings";
import { isCurrencySupported } from "~/renderer/screens/exchange/config";
import { setTrackingSource } from "~/renderer/analytics/TrackPage";
import { context as drawersContext } from "~/renderer/drawers/Provider";
import AccountSettingRenderBody from "~/renderer/modals/SettingsAccount/AccountSettingRenderBody";
import { ReceiveDrawer } from "~/renderer/drawers/ReceiveFlow";

type Props = {
  account: AccountLike;
  parentAccount?: Account;
  leftClick?: boolean;
  children: any;
  withStar?: boolean;
};

export default function AccountContextMenu({
  leftClick,
  children,
  account,
  parentAccount,
  withStar,
}: Props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const refreshAccountsOrdering = useRefreshAccountsOrdering();
  const swapSelectableCurrencies = useSelector(swapSelectableCurrenciesSelector);

  const { setDrawer } = useContext(drawersContext);

  const menuItems = useMemo(() => {
    const currency = getAccountCurrency(account);
    const mainAccount = getMainAccount(account, parentAccount);

    const categorySendReceive: ContextMenuItemType[] = [];
    const categoryExchange: ContextMenuItemType[] = [];
    const categoryOptions: ContextMenuItemType[] = [];
    const getItemsWithSeparators = () => {
      return [categorySendReceive, categoryExchange, categoryOptions]
        .flatMap(category => (category.length === 0 ? [] : [...category, "separator"]))
        .slice(0, -1);
    };

    categorySendReceive.push(
      {
        label: "accounts.contextMenu.send",
        Icon: Icons.ArrowTopMedium,
        callback: () => dispatch(openModal("MODAL_SEND", { account, parentAccount })),
      },
      {
        label: "accounts.contextMenu.receive",
        Icon: Icons.ArrowBottomMedium,
        callback: () =>
          setDrawer(ReceiveDrawer, { account, parentAccount }, ReceiveDrawer.initialOptions),
      },
    );

    const availableOnBuy = isCurrencySupported("BUY", currency);
    if (availableOnBuy) {
      categoryExchange.push({
        label: "accounts.contextMenu.buy",
        Icon: Icons.PlusMedium,
        callback: () => {
          setTrackingSource("account context menu");
          history.push({
            pathname: "/exchange",
            state: {
              defaultCurrency: currency,
              defaultAccount: mainAccount,
            },
          });
        },
      });
    }

    const availableOnSell = isCurrencySupported("SELL", currency);
    if (availableOnSell) {
      categoryExchange.push({
        label: "accounts.contextMenu.sell",
        Icon: Icons.MinusMedium,
        callback: () => {
          setTrackingSource("account context menu");
          history.push({
            pathname: "/exchange",
            state: {
              tab: 1,
              defaultCurrency: currency,
              defaultAccount: mainAccount,
            },
          });
        },
      });
    }

    const availableOnSwap = swapSelectableCurrencies.includes(currency.id);
    if (availableOnSwap) {
      categoryExchange.push({
        label: "accounts.contextMenu.swap",
        Icon: Icons.BuyCryptoMedium,
        callback: () => {
          setTrackingSource("account context menu");
          history.push({
            pathname: "/swap",
            state: {
              defaultCurrency: currency,
              defaultAccount: account,
              defaultParentAccount: parentAccount,
            },
          });
        },
      });
    }

    if (account.type === "TokenAccount") {
      categoryOptions.push({
        label: "accounts.contextMenu.hideToken",
        Icon: Icons.NoneMedium,
        id: "token-menu-hide",
        callback: () => dispatch(openModal("MODAL_BLACKLIST_TOKEN", { token: account.token })),
      });
    }

    if (account.type === "Account") {
      categoryOptions.push({
        label: "accounts.contextMenu.edit",
        Icon: Icons.ToolMedium,
        callback: () => {
          setDrawer(AccountSettingRenderBody, { data: { account } }, {});
        },
      });
    }

    const items = getItemsWithSeparators();

    return items;
  }, [
    account,
    history,
    parentAccount,
    withStar,
    dispatch,
    refreshAccountsOrdering,
    swapSelectableCurrencies,
  ]);

  const currency = getAccountCurrency(account);

  return (
    <ContextMenuItem
      event={account.type === "Account" ? "Account right click" : "Token right click"}
      eventProperties={{ currencyName: currency.name }}
      leftClick={leftClick}
      items={menuItems}
    >
      {children}
    </ContextMenuItem>
  );
}

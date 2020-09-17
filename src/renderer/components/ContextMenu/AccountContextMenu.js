// @flow

import React, { PureComponent } from "react";
import { openModal } from "~/renderer/actions/modals";
import type {
  Account,
  AccountLike,
  CryptoCurrency,
  TokenCurrency,
} from "@ledgerhq/live-common/lib/types";
import { connect } from "react-redux";
import IconReceive from "~/renderer/icons/Receive";
import IconSend from "~/renderer/icons/Send";
import IconStar from "~/renderer/icons/Star";
import IconBuy from "~/renderer/icons/Exchange";
import IconSwap from "~/renderer/icons/Swap";
import IconBan from "~/renderer/icons/Ban";
import IconAccountSettings from "~/renderer/icons/AccountSettings";
import ContextMenuItem from "./ContextMenuItem";
import { toggleStarAction } from "~/renderer/actions/accounts";
import { swapSupportedCurrenciesSelector } from "~/renderer/reducers/application";
import { createStructuredSelector } from "reselect";
import { refreshAccountsOrdering } from "~/renderer/actions/general";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import { isCurrencySupported } from "~/renderer/screens/exchange/config";
import { getMainAccount, getAccountCurrency } from "@ledgerhq/live-common/lib/account/helpers";

type OwnProps = {
  account: AccountLike,
  parentAccount?: ?Account,
  leftClick?: boolean,
  children: any,
};

type Props = {
  ...OwnProps,
  withStar?: boolean,
  openModal: Function,
  history: *,
  toggleStarAction: Function,
  refreshAccountsOrdering: Function,
  swapSupportedCurrencies: (CryptoCurrency | TokenCurrency)[],
};

const mapDispatchToProps = {
  openModal,
  toggleStarAction,
  refreshAccountsOrdering,
};

class AccountContextMenu extends PureComponent<Props> {
  getContextMenuItems = () => {
    const {
      openModal,
      account,
      parentAccount,
      withStar,
      toggleStarAction,
      refreshAccountsOrdering,
      history,
      swapSupportedCurrencies,
    } = this.props;
    const currency = getAccountCurrency(account);

    const items = [
      {
        label: "accounts.contextMenu.send",
        Icon: IconSend,
        callback: () => openModal("MODAL_SEND", { account, parentAccount }),
      },
      {
        label: "accounts.contextMenu.receive",
        Icon: IconReceive,
        callback: () => openModal("MODAL_RECEIVE", { account, parentAccount }),
      },
    ];

    const availableOnExchange = isCurrencySupported(currency);

    if (availableOnExchange) {
      items.push({
        label: "accounts.contextMenu.buy",
        Icon: IconBuy,
        callback: () => history.push("/exchange"),
      });
    }

    const availableOnSwap = swapSupportedCurrencies.includes(currency);
    if (availableOnSwap) {
      items.push({
        label: "accounts.contextMenu.swap",
        Icon: IconSwap,
        callback: () =>
          history.push({
            pathname: "/swap",
            state: {
              defaultCurrency: currency,
              defaultAccount: getMainAccount(account, parentAccount),
            },
          }),
      });
    }

    if (withStar) {
      items.push({
        label: "accounts.contextMenu.star",
        Icon: IconStar,
        callback: () => {
          toggleStarAction(account.id, account.type !== "Account" ? account.parentId : undefined);
          refreshAccountsOrdering();
        },
      });
    }

    if (account.type === "Account") {
      items.push({
        label: "accounts.contextMenu.edit",
        Icon: IconAccountSettings,
        callback: () => openModal("MODAL_SETTINGS_ACCOUNT", { account }),
      });
    }

    if (account.type === "TokenAccount") {
      items.push({
        label: "accounts.contextMenu.hideToken",
        Icon: IconBan,
        callback: () => openModal("MODAL_BLACKLIST_TOKEN", { token: account.token }),
      });
    }

    return items;
  };

  render() {
    const { leftClick, children, account } = this.props;
    const currency = getAccountCurrency(account);

    return (
      <ContextMenuItem
        event={account.type === "Account" ? "Account right click" : "Token right click"}
        eventProperties={{ currencyName: currency.name }}
        leftClick={leftClick}
        items={this.getContextMenuItems()}
      >
        {children}
      </ContextMenuItem>
    );
  }
}

const ConnectedAccountContextMenu: React$ComponentType<OwnProps> = compose(
  connect(
    createStructuredSelector({
      swapSupportedCurrencies: swapSupportedCurrenciesSelector,
    }),
    mapDispatchToProps,
  ),
  withRouter,
)(AccountContextMenu);

export default ConnectedAccountContextMenu;

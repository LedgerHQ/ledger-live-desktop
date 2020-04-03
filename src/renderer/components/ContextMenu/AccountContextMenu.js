// @flow

import React, { PureComponent } from "react";
import { openModal } from "~/renderer/actions/modals";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types/account";
import { connect } from "react-redux";
import IconReceive from "~/renderer/icons/Receive";
import IconSend from "~/renderer/icons/Send";
import IconStar from "~/renderer/icons/Star";
import IconBan from "~/renderer/icons/Ban";
import IconAccountSettings from "~/renderer/icons/AccountSettings";
import ContextMenuItem from "./ContextMenuItem";
import { toggleStarAction } from "~/renderer/actions/accounts";
import { refreshAccountsOrdering } from "~/renderer/actions/general";

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
  toggleStarAction: Function,
  refreshAccountsOrdering: Function,
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
    } = this.props;
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
    const { leftClick, children } = this.props;
    return (
      <ContextMenuItem leftClick={leftClick} items={this.getContextMenuItems()}>
        {children}
      </ContextMenuItem>
    );
  }
}

const ConnectedAccountContextMenu: React$ComponentType<OwnProps> = connect(
  null,
  mapDispatchToProps,
)(AccountContextMenu);

export default ConnectedAccountContextMenu;

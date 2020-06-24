// @flow

import React, { useCallback } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import styled from "styled-components";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";
import Tooltip from "~/renderer/components/Tooltip";
import {
  isAccountEmpty,
  canSend,
  getMainAccount,
  getAccountCurrency,
} from "@ledgerhq/live-common/lib/account";
import type { TFunction } from "react-i18next";
import { rgba } from "~/renderer/styles/helpers";
import { openModal } from "~/renderer/actions/modals";
import IconAccountSettings from "~/renderer/icons/AccountSettings";
import perFamily from "~/renderer/generated/AccountHeaderActions";
import Box, { Tabbable } from "~/renderer/components/Box";
import Star from "~/renderer/components/Stars/Star";
import { ReceiveActionDefault, SendActionDefault, BuyActionDefault } from "./AccountActionsDefault";
import perFamilyAccountActions from "~/renderer/generated/accountActions";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { isCurrencySupported } from "~/renderer/screens/exchange/config";
import { useHistory } from "react-router-dom";

const ButtonSettings: ThemedComponent<{ disabled?: boolean }> = styled(Tabbable).attrs(() => ({
  alignItems: "center",
  justifyContent: "center",
}))`
  width: 34px;
  height: 34px;
  border: 1px solid ${p => p.theme.colors.palette.text.shade60};
  border-radius: 4px;
  &:hover {
    color: ${p => (p.disabled ? "" : p.theme.colors.palette.text.shade100)};
    background: ${p => (p.disabled ? "" : rgba(p.theme.colors.palette.divider, 0.2))};
    border-color: ${p => p.theme.colors.palette.text.shade100};
  }

  &:active {
    background: ${p => (p.disabled ? "" : rgba(p.theme.colors.palette.divider, 0.3))};
  }
`;

const mapDispatchToProps = {
  openModal,
};

type OwnProps = {
  account: AccountLike,
  parentAccount: ?Account,
};

type Props = OwnProps & {
  t: TFunction,
  openModal: Function,
};

const AccountHeaderActions = ({ account, parentAccount, openModal, t }: Props) => {
  const mainAccount = getMainAccount(account, parentAccount);
  const PerFamily = perFamily[mainAccount.currency.family];
  const decorators = perFamilyAccountActions[mainAccount.currency.family];
  const SendAction = (decorators && decorators.SendAction) || SendActionDefault;
  const ReceiveAction = (decorators && decorators.ReceiveAction) || ReceiveActionDefault;
  const currency = getAccountCurrency(account);
  const availableOnExchange = isCurrencySupported(currency);
  const history = useHistory();

  const onSend = useCallback(() => {
    openModal("MODAL_SEND", { parentAccount, account });
  }, [parentAccount, account, openModal]);

  const onReceive = useCallback(() => {
    openModal("MODAL_RECEIVE", { parentAccount, account });
  }, [parentAccount, account, openModal]);

  const onBuy = useCallback(() => {
    history.push("/exchange");
  }, [history]);

  return (
    <Box horizontal alignItems="center" justifyContent="flex-end" flow={2}>
      <>
        {PerFamily ? <PerFamily account={account} parentAccount={parentAccount} /> : null}
        {canSend(account, parentAccount) ? (
          <SendAction
            disabled={isAccountEmpty(account)}
            account={account}
            parentAccount={parentAccount}
            onClick={onSend}
          />
        ) : null}

        <ReceiveAction account={account} parentAccount={parentAccount} onClick={onReceive} />
        {availableOnExchange ? <BuyActionDefault currency={currency} onClick={onBuy} /> : null}
      </>

      <Tooltip content={t("stars.tooltip")}>
        <Star
          accountId={account.id}
          parentId={account.type !== "Account" ? account.parentId : undefined}
          yellow
        />
      </Tooltip>
      {account.type === "Account" ? (
        <Tooltip content={t("account.settings.title")}>
          <ButtonSettings
            onClick={() => openModal("MODAL_SETTINGS_ACCOUNT", { parentAccount, account })}
          >
            <Box justifyContent="center">
              <IconAccountSettings size={14} />
            </Box>
          </ButtonSettings>
        </Tooltip>
      ) : null}
    </Box>
  );
};

const ConnectedAccountHeaderActions: React$ComponentType<OwnProps> = compose(
  connect(null, mapDispatchToProps),
  withTranslation(),
)(AccountHeaderActions);

export default ConnectedAccountHeaderActions;

// @flow

import React, { useCallback } from "react";
import { compose } from "redux";
import { useSelector, connect } from "react-redux";
import { withTranslation, Trans } from "react-i18next";
import styled from "styled-components";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";
import { swapSupportedCurrenciesSelector } from "~/renderer/reducers/settings";
import Tooltip from "~/renderer/components/Tooltip";
import {
  isAccountEmpty,
  canSend,
  getMainAccount,
  getAccountCurrency,
} from "@ledgerhq/live-common/lib/account";
import { makeCompoundSummaryForAccount } from "@ledgerhq/live-common/lib/compound/logic";
import type { TFunction } from "react-i18next";
import { rgba } from "~/renderer/styles/helpers";
import { openModal } from "~/renderer/actions/modals";
import IconAccountSettings from "~/renderer/icons/AccountSettings";
import perFamily from "~/renderer/generated/AccountHeaderActions";
import Box, { Tabbable } from "~/renderer/components/Box";
import Star from "~/renderer/components/Stars/Star";
import { ReceiveActionDefault, SendActionDefault } from "./AccountActionsDefault";
import perFamilyAccountActions from "~/renderer/generated/accountActions";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { isCurrencySupported } from "~/renderer/screens/exchange/config";
import { useHistory } from "react-router-dom";
import IconExchange from "~/renderer/icons/Exchange";
import IconSwap from "~/renderer/icons/Swap";
import DropDownSelector from "~/renderer/components/DropDownSelector";
import Button from "~/renderer/components/Button";
import Text from "~/renderer/components/Text";
import Graph from "~/renderer/icons/Graph";
import IconAngleDown from "~/renderer/icons/AngleDown";
import IconAngleUp from "~/renderer/icons/AngleUp";

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
  isCompoundEnabled?: boolean,
};

const AccountHeaderActions = ({
  account,
  parentAccount,
  openModal,
  t,
  isCompoundEnabled,
}: Props) => {
  const mainAccount = getMainAccount(account, parentAccount);
  const PerFamily = perFamily[mainAccount.currency.family];
  const decorators = perFamilyAccountActions[mainAccount.currency.family];
  const SendAction = (decorators && decorators.SendAction) || SendActionDefault;
  const ReceiveAction = (decorators && decorators.ReceiveAction) || ReceiveActionDefault;
  const currency = getAccountCurrency(account);

  const summary =
    account.type === "TokenAccount" && makeCompoundSummaryForAccount(account, parentAccount);
  const availableOnCompound = !!summary;

  const availableOnBuy = isCurrencySupported("BUY", currency);
  const availableOnSell = isCurrencySupported("SELL", currency);
  const availableOnSwap = useSelector(swapSupportedCurrenciesSelector);
  const history = useHistory();

  const onBuy = useCallback(() => {
    history.push({
      pathname: "/exchange",
      state: {
        defaultCurrency: currency,
        defaultAccount: mainAccount,
        source: "account header actions",
      },
    });
  }, [currency, history, mainAccount]);

  const onLend = useCallback(() => {
    openModal("MODAL_LEND_MANAGE", {
      ...summary,
    });
  }, [openModal, summary]);

  const onSell = useCallback(() => {
    history.push({
      pathname: "/exchange",
      state: {
        tab: 1,
        defaultCurrency: currency,
        defaultAccount: mainAccount,
      },
    });
  }, [currency, history, mainAccount]);

  const onSwap = useCallback(() => {
    history.push({
      pathname: "/swap",
      state: {
        defaultCurrency: currency,
        defaultAccount: account,
        defaultParentAccount: parentAccount,
        source: "account header actions",
      },
    });
  }, [currency, history, account, parentAccount]);

  // List of available exchange actions
  const actions = [
    ...(availableOnBuy
      ? [
          {
            key: "Buy",
            onClick: onBuy,
            event: "Buy Crypto Account Button",
            eventProperties: { currencyName: currency.name },
            icon: IconExchange,
            label: <Trans i18nKey="buy.titleCrypto" values={{ currency: currency.name }} />,
          },
        ]
      : []),
    ...(availableOnSell
      ? [
          {
            key: "Sell",
            onClick: onSell,
            event: "Sell Crypto Account Button",
            eventProperties: { currencyName: currency.name },
            icon: IconExchange,
            label: <Trans i18nKey="sell.titleCrypto" values={{ currency: currency.name }} />,
          },
        ]
      : []),
    ...(availableOnCompound
      ? [
          {
            key: "Lend",
            onClick: onLend,
            event: "Lend Crypto Account Button",
            eventProperties: { currencyName: currency.name },
            icon: Graph,
            label: <Trans i18nKey="lend.manage.cta" />,
          },
        ]
      : []),
    ...(availableOnSwap.includes(currency)
      ? [
          {
            key: "Swap",
            onClick: onSwap,
            event: "Swap Crypto Account Button",
            eventProperties: { currencyName: currency.name },
            icon: IconSwap,
            label: <Trans i18nKey="swap.titleCrypto" values={{ currency: currency.name }} />,
          },
        ]
      : []),
  ];

  const onSend = useCallback(() => {
    openModal("MODAL_SEND", { parentAccount, account });
  }, [parentAccount, account, openModal]);

  const onReceive = useCallback(() => {
    openModal("MODAL_RECEIVE", { parentAccount, account });
  }, [parentAccount, account, openModal]);

  const renderItem = useCallback(
    ({ item: { key, label, onClick, event, eventProperties, icon }, isActive }) => {
      const Icon = icon;
      return (
        <Button onClick={onClick} event={event} eventProperties={eventProperties}>
          <Box horizontal flow={1} alignItems="center">
            {Icon && <Icon size={14} />}
            <Box>
              <Text ff="Inter|SemiBold">{label}</Text>
            </Box>
          </Box>
        </Button>
      );
    },
    [],
  );

  return (
    <Box horizontal alignItems="center" justifyContent="flex-end" flow={2} mt={15}>
      {!isAccountEmpty(account) ? (
        <>
          {PerFamily ? <PerFamily account={account} parentAccount={parentAccount} /> : null}
          {canSend(account, parentAccount) ? (
            <SendAction account={account} parentAccount={parentAccount} onClick={onSend} />
          ) : null}

          <ReceiveAction account={account} parentAccount={parentAccount} onClick={onReceive} />
          {actions && actions.length > 0 ? (
            <DropDownSelector border horizontal items={actions} renderItem={renderItem} controlled>
              {({ isOpen, value }) => (
                <Button small primary>
                  <Box horizontal flow={1} alignItems="center">
                    <Box>
                      <Trans i18nKey="common.exchange" values={{ currency: currency.name }} />
                    </Box>
                    {isOpen ? <IconAngleUp size={16} /> : <IconAngleDown size={16} />}
                  </Box>
                </Button>
              )}
            </DropDownSelector>
          ) : null}
        </>
      ) : null}
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

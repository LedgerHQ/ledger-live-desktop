// @flow

import React, { useCallback } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withTranslation, Trans } from "react-i18next";
import styled from "styled-components";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";
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
import Box, { Tabbable } from "~/renderer/components/Box";
import Star from "~/renderer/components/Stars/Star";
import {
  ActionDefault,
  BuyActionDefault,
  ReceiveActionDefault,
  SendActionDefault,
  SwapActionDefault,
} from "./AccountActionsDefault";
import perFamilyAccountActions from "~/renderer/generated/accountActions";
import perFamilyManageActions from "~/renderer/generated/AccountHeaderManageActions";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { isCurrencySupported } from "~/renderer/screens/exchange/config";
import { useHistory } from "react-router-dom";
import IconWalletConnect from "~/renderer/icons/WalletConnect";
import IconCoins from "~/renderer/icons/ClaimReward";
import Graph from "~/renderer/icons/Graph";
import { setTrackingSource } from "~/renderer/analytics/TrackPage";
import useTheme from "~/renderer/hooks/useTheme";
import useCompoundAccountEnabled from "~/renderer/screens/lend/useCompoundAccountEnabled";
import { useProviders } from "~/renderer/screens/exchange/Swap2/Form";

const ButtonSettings: ThemedComponent<{ disabled?: boolean }> = styled(Tabbable).attrs(() => ({
  alignItems: "center",
  justifyContent: "center",
}))`
  width: 40px;
  height: 40px;
  border: 1px solid ${p => p.theme.colors.palette.text.shade60};
  border-radius: 20px;
  &:hover {
    color: ${p => (p.disabled ? "" : p.theme.colors.palette.text.shade100)};
    background: ${p => (p.disabled ? "" : rgba(p.theme.colors.palette.divider, 0.2))};
    border-color: ${p => p.theme.colors.palette.text.shade100};
  }

  &:active {
    background: ${p => (p.disabled ? "" : rgba(p.theme.colors.palette.divider, 0.3))};
  }
`;

const FadeInButtonsContainer = styled(Box).attrs(() => ({
  horizontal: true,
  flow: 2,
  alignItems: "center",
}))`
  pointer-events: ${p => !p.show && "none"};
  opacity: ${p => (p.show ? 1 : 0)};
  transition: opacity 400ms ease-in;
`;

const mapDispatchToProps = {
  openModal,
};

type OwnProps = {
  account: AccountLike,
  parentAccount?: Account,
};

type Props = {
  t: TFunction,
  openModal: Function,
} & OwnProps;

const AccountHeaderActions = ({ account, parentAccount, openModal, t }: Props) => {
  const mainAccount = getMainAccount(account, parentAccount);
  const contrastText = useTheme("colors.palette.text.shade60");

  const decorators = perFamilyAccountActions[mainAccount.currency.family];
  const manage = perFamilyManageActions[mainAccount.currency.family];
  let manageList = [];
  if (manage) {
    const familyManageActions = manage({ account, parentAccount });
    manageList = familyManageActions && familyManageActions.length > 0 ? familyManageActions : [];
  }
  const SendAction = (decorators && decorators.SendAction) || SendActionDefault;
  const ReceiveAction = (decorators && decorators.ReceiveAction) || ReceiveActionDefault;
  const currency = getAccountCurrency(account);

  // check if account already has lending enabled
  const summary =
    account.type === "TokenAccount" && makeCompoundSummaryForAccount(account, parentAccount);

  const availableOnCompound = useCompoundAccountEnabled(account, parentAccount);

  const availableOnBuy = isCurrencySupported("BUY", currency);

  const { providers, storedProviders, providersError } = useProviders();

  // don't show buttons until we know whether or not we can show swap button, otherwise possible click jacking
  const showButtons = !!(providers || storedProviders || providersError);
  const availableOnSwap =
    (providers || storedProviders) &&
    !!(providers || storedProviders).find(({ pairs }) => {
      return pairs && pairs.find(({ from, to }) => [from, to].includes(currency.id));
    });

  const history = useHistory();

  const onBuy = useCallback(() => {
    setTrackingSource("account header actions");
    history.push({
      pathname: "/exchange",
      state: {
        defaultCurrency: currency,
        defaultAccount: mainAccount,
      },
    });
  }, [currency, history, mainAccount]);

  const onLend = useCallback(() => {
    openModal("MODAL_LEND_MANAGE", {
      ...summary,
    });
  }, [openModal, summary]);

  const onSwap = useCallback(() => {
    setTrackingSource("account header actions");
    history.push({
      pathname: "/swap",
      state: {
        defaultCurrency: currency,
        defaultAccount: account,
        defaultParentAccount: parentAccount,
      },
    });
  }, [currency, history, account, parentAccount]);

  const onWalletConnect = useCallback(() => {
    setTrackingSource("account header actions");
    openModal("MODAL_WALLETCONNECT_PASTE_LINK", { account });
  }, [openModal, account]);

  const onPlatformStake = useCallback(() => {
    setTrackingSource("account header actions");

    history.push({ pathname: "/platform/lido", state: { accountId: account.id } });
  }, [history, account]);

  const onSend = useCallback(() => {
    openModal("MODAL_SEND", { parentAccount, account });
  }, [parentAccount, account, openModal]);

  const onReceive = useCallback(() => {
    openModal("MODAL_RECEIVE", { parentAccount, account });
  }, [parentAccount, account, openModal]);

  const renderAction = ({ label, onClick, event, eventProperties, icon, disabled }) => {
    const Icon = icon;
    return (
      <ActionDefault
        disabled={disabled}
        onClick={onClick}
        event={event}
        eventProperties={eventProperties}
        iconComponent={Icon && <Icon size={14} overrideColor={contrastText} currency={currency} />}
        labelComponent={label}
      />
    );
  };

  const manageActions: {
    label: any,
    onClick: () => void,
    event?: string,
    eventProperties?: Object,
    icon: React$ComponentType<{ size: number }> | (({ size: number }) => React$Element<any>),
    disabled?: boolean,
  }[] = [
    ...manageList,
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
    ...(currency.id === "ethereum"
      ? [
          {
            key: "Stake",
            onClick: onPlatformStake,
            event: "Eth Stake Account Button",
            icon: IconCoins,
            label: <Trans i18nKey="account.stake" values={{ currency: currency.name }} />,
          },
          {
            key: "WalletConnect",
            onClick: onWalletConnect,
            event: "Wallet Connect Account Button",
            eventProperties: { currencyName: currency.name },
            icon: IconWalletConnect,
            label: <Trans i18nKey="walletconnect.titleAccount" />,
          },
        ]
      : []),
  ];

  const BuyHeader = <BuyActionDefault onClick={onBuy} />;

  const SwapHeader = <SwapActionDefault onClick={onSwap} />;

  const ManageActionsHeader = manageActions.map(item => renderAction(item));

  const NonEmptyAccountHeader = (
    <FadeInButtonsContainer data-test-id="account-buttons-group" show={showButtons}>
      {canSend(account, parentAccount) && (
        <SendAction account={account} parentAccount={parentAccount} onClick={onSend} />
      )}
      <ReceiveAction account={account} parentAccount={parentAccount} onClick={onReceive} />
      {availableOnBuy && BuyHeader}
      {availableOnSwap && SwapHeader}
      {manageActions.length > 0 && ManageActionsHeader}
    </FadeInButtonsContainer>
  );

  return (
    <Box horizontal alignItems="center" justifyContent="flex-end" flow={2} mt={15}>
      {!isAccountEmpty(account) ? NonEmptyAccountHeader : null}
      <Tooltip content={t("stars.tooltip")}>
        <Star
          accountId={account.id}
          parentId={account.type !== "Account" ? account.parentId : undefined}
          yellow
          rounded
        />
      </Tooltip>
      {account.type === "Account" ? (
        <Tooltip content={t("account.settings.title")}>
          <ButtonSettings
            data-test-id="account-settings-button"
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

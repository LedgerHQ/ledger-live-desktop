import React, { useCallback, useContext } from "react";
import { compose } from "redux";
import { useSelector, connect } from "react-redux";
import { withTranslation, Trans, TFunction } from "react-i18next";
import { Account, AccountLike } from "@ledgerhq/live-common/lib/types";
import { Button, Flex, Icons } from "@ledgerhq/react-ui";
import { swapSelectableCurrenciesSelector } from "~/renderer/reducers/settings";
import Tooltip from "~/renderer/components/Tooltip";
import { context as drawersContext } from "~/renderer/drawers/Provider";
import {
  isAccountEmpty,
  canSend,
  getMainAccount,
  getAccountCurrency,
} from "@ledgerhq/live-common/lib/account";
import { makeCompoundSummaryForAccount } from "@ledgerhq/live-common/lib/compound/logic";
import { openModal } from "~/renderer/actions/modals";
import IconAccountSettings from "~/renderer/icons/AccountSettings";
import perFamilyManageActions from "~/renderer/generated/AccountHeaderManageActions";
import {
  BuyActionDefault,
  ReceiveActionDefault,
  SendActionDefault,
  SwapActionDefault,
} from "./AccountActionsDefault";
import perFamilyAccountActions from "~/renderer/generated/accountActions";
import { isCurrencySupported } from "~/renderer/screens/exchange/config";
import { useHistory } from "react-router-dom";
import IconWalletConnect from "~/renderer/icons/WalletConnect";
import IconSend from "~/renderer/icons/Send";
import IconReceive from "~/renderer/icons/Receive";
import DropDownSelector from "~/renderer/components/DropDownSelector";
import Graph from "~/renderer/icons/Graph";
import { setTrackingSource } from "~/renderer/analytics/TrackPage";
import useTheme from "~/renderer/hooks/useTheme";
import useCompoundAccountEnabled from "~/renderer/screens/lend/useCompoundAccountEnabled";
import AccountSettingRenderBody from "~/renderer/modals/SettingsAccount/AccountSettingRenderBody";
import { ReceiveDrawer } from "~/renderer/drawers/ReceiveFlow";

const mapDispatchToProps = {
  openModal,
};

type OwnProps = {
  account: AccountLike;
  parentAccount?: Account;
};

type Props = {
  t: TFunction;
  openModal: Function;
} & OwnProps;

const AccountHeaderActions = ({ account, parentAccount, openModal, t }: Props) => {
  const { setDrawer } = useContext(drawersContext);
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
  const availableOnSwap = useSelector(swapSelectableCurrenciesSelector);
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

  const onSend = useCallback(() => {
    openModal("MODAL_SEND", { parentAccount, account });
  }, [parentAccount, account, openModal]);

  const onReceive = useCallback(() => {
    setDrawer(ReceiveDrawer, { account, parentAccount }, ReceiveDrawer.initialOptions);
  }, [parentAccount, account, setDrawer]);

  const renderItem = useCallback(
    ({ item: { label, onClick, event, eventProperties, icon } }) => {
      const Icon = icon;
      return (
        <Button
          Icon={Icon}
          iconPosition="left"
          onClick={onClick}
          event={event}
          eventProperties={eventProperties}
          variant="main"
        >
          {label}
        </Button>
      );
    },
    [currency, contrastText],
  );

  const manageActions = [
    {
      key: "Send",
      onClick: onSend,
      icon: IconSend,
      label: <Trans i18nKey="send.title" />,
    },
    {
      key: "Receive",
      onClick: onReceive,
      icon: IconReceive,
      label: <Trans i18nKey="receive.title" />,
    },
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
            key: "WalletConnect",
            onClick: onWalletConnect,
            event: "Wallet Connect Account Button",
            icon: IconWalletConnect,
            label: <Trans i18nKey="walletconnect.titleAccount" />,
          },
        ]
      : []),
  ];

  const canBuySwap = availableOnBuy || availableOnSwap.includes(currency.id);
  const BuySwapHeader = () => (
    <>
      {availableOnBuy ? <BuyActionDefault onClick={onBuy} /> : null}
      {availableOnSwap.includes(currency.id) ? <SwapActionDefault onClick={onSwap} /> : null}
      {manageActions && manageActions.length > 0 ? (
        <DropDownSelector
          border
          horizontal
          items={manageActions}
          renderItem={renderItem}
          controlled
          buttonId="account-actions-manage"
        >
          {({ isOpen }) => (
            <Button
              variant="main"
              Icon={isOpen ? Icons.DropupMedium : Icons.DropdownMedium}
              iconPosition="right"
            >
              <Trans i18nKey="common.manage" values={{ currency: currency.name }} />
            </Button>
          )}
        </DropDownSelector>
      ) : null}
    </>
  );

  return (
    <Flex flexDirection="row" alignItems="center" justifyContent="flex-end" columnGap={5}>
      {!isAccountEmpty(account) ? (
        canBuySwap ? (
          <BuySwapHeader />
        ) : (
          <>
            {canSend(account, parentAccount) ? (
              <SendAction account={account} parentAccount={parentAccount} onClick={onSend} />
            ) : null}

            <ReceiveAction account={account} parentAccount={parentAccount} onClick={onReceive} />
          </>
        )
      ) : null}
      {account.type === "Account" ? (
        <Tooltip content={t("account.settings.title")}>
          <Button
            variant="shade"
            outline
            id="account-settings-button"
            onClick={() =>
              setDrawer(AccountSettingRenderBody, { data: { parentAccount, account } }, {})
            }
            Icon={IconAccountSettings}
          />
        </Tooltip>
      ) : null}
    </Flex>
  );
};

const ConnectedAccountHeaderActions: React.ReactComponentType<OwnProps> = compose(
  connect(null, mapDispatchToProps),
  withTranslation(),
)(AccountHeaderActions);

export default ConnectedAccountHeaderActions;

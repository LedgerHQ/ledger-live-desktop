// @flow
import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import SummaryLabel from "./SummaryLabel";
import SectionInformative from "./SectionInformative";
import SummaryValue, { NoValuePlaceholder } from "./SummaryValue";
import { useTranslation } from "react-i18next";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import { getAccountName } from "@ledgerhq/live-common/lib/account";
import type { TokenCurrency, CryptoCurrency } from "@ledgerhq/live-common/lib/types";
import SummarySection from "./SummarySection";
import { openModal } from "~/renderer/actions/modals";
import { context } from "~/renderer/drawers/Provider";

import type {
  SwapSelectorStateType,
  SwapTransactionType,
} from "@ledgerhq/live-common/lib/exchange/swap/hooks";
import TargetAccountDrawer from "../TargetAccountDrawer";

const AccountSection = ({
  account,
  currency,
  handleChange,
}: {
  account: $PropertyType<SwapSelectorStateType, "account">,
  currency: TokenCurrency | CryptoCurrency,
  handleChange: ?() => void,
}) => {
  const { t } = useTranslation();
  const accountName = getAccountName(account);

  return (
    <SummarySection>
      <SummaryLabel label={t("swap2.form.details.label.target")} />
      <SummaryValue value={accountName} handleChange={handleChange}>
        {currency ? <CryptoCurrencyIcon circle currency={currency} size={16} /> : null}
      </SummaryValue>
    </SummarySection>
  );
};

const PlaceholderSection = () => {
  const { t } = useTranslation();

  return (
    <SummarySection>
      <SummaryLabel label={t("swap2.form.details.label.target")} />
      <SummaryValue>
        <NoValuePlaceholder />
      </SummaryValue>
    </SummarySection>
  );
};

type SectionTargetProps = {
  account: $PropertyType<SwapSelectorStateType, "account">,
  currency: $PropertyType<SwapSelectorStateType, "currency">,
  setToAccount: $PropertyType<SwapTransactionType, "setToAccount">,
  targetAccounts: $PropertyType<SwapTransactionType, "targetAccounts">,
  hasRates: boolean,
};
const SectionTarget = ({
  account,
  currency,
  setToAccount,
  targetAccounts,
  hasRates,
}: SectionTargetProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { setDrawer } = React.useContext(context);

  const handleAddAccount = () =>
    dispatch(openModal("MODAL_ADD_ACCOUNTS", { currency, flow: "swap" }));
  const hideEdit = !targetAccounts || targetAccounts.length < 2;

  // Using a ref to keep the drawer state synced.
  const setDrawerStateRef = useRef(null);
  useEffect(() => {
    setDrawerStateRef.current &&
      setDrawerStateRef.current({
        selectedAccount: account,
        targetAccounts,
      });
  }, [account, targetAccounts]);

  const showDrawer = () =>
    setDrawer(TargetAccountDrawer, {
      accounts: targetAccounts,
      selectedAccount: account,
      setToAccount: setToAccount,
      setDrawerStateRef: setDrawerStateRef,
    });
  const handleEditAccount = hideEdit ? null : showDrawer;

  if (!currency || !hasRates) return <PlaceholderSection />;
  if (!account)
    return (
      <SectionInformative
        onClick={handleAddAccount}
        ctaLabel={t("swap2.form.details.noAccountCTA")}
        message={t("swap2.form.details.noAccount", { name: currency.name })}
      />
    );

  return <AccountSection account={account} currency={currency} handleChange={handleEditAccount} />;
};

export default React.memo<SectionTargetProps>(SectionTarget);

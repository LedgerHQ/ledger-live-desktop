// @flow
import React, { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import SummaryLabel from "./SummaryLabel";
import SectionInformative from "./SectionInformative";
import SummaryValue from "./SummaryValue";
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
} from "~/renderer/screens/exchange/Swap2/utils/shared/useSwapTransaction";
import TargetAccountDrawer from "../TargetAccountDrawer";
import { shallowAccountsSelector } from "~/renderer/reducers/accounts";
import { getAccountTuplesForCurrency } from "~/renderer/components/PerCurrencySelectAccount/state";

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
      <SummaryValue />
    </SummarySection>
  );
};

type SectionTargetProps = {
  account: $PropertyType<SwapSelectorStateType, "account">,
  currency: $PropertyType<SwapSelectorStateType, "currency">,
  setToAccount: $PropertyType<SwapTransactionType, "setToAccount">,
};
const SectionTarget = ({ account, currency, setToAccount }: SectionTargetProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { setDrawer } = React.useContext(context);
  const accounts = useSelector(shallowAccountsSelector);
  const filteredAccounts = useMemo(
    () =>
      currency &&
      getAccountTuplesForCurrency(currency, accounts, false).map(({ account }) => account),
    [currency, accounts],
  );

  const handleAddAccount = () => dispatch(openModal("MODAL_ADD_ACCOUNTS", { currency }));
  const hideEdit = !filteredAccounts || filteredAccounts.length < 2;

  // Using a ref to keep the drawer state synced.
  const setDrawerStateRef = useRef(null);
  useEffect(() => {
    setDrawerStateRef.current &&
      setDrawerStateRef.current({
        selectedAccount: account,
        filteredAccounts,
      });
  }, [account, filteredAccounts]);

  const showDrawer = () =>
    setDrawer(TargetAccountDrawer, {
      accounts: filteredAccounts,
      selectedAccount: account,
      setToAccount: setToAccount,
      setDrawerStateRef: setDrawerStateRef,
    });
  const handleEditAccount = hideEdit ? null : showDrawer;

  if (!currency) return <PlaceholderSection />;
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

export default SectionTarget;

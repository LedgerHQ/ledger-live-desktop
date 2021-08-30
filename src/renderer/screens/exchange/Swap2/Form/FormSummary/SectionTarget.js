// @flow
import React from "react";
import SummaryLabel from "./SummaryLabel";
import SectionInformative from "./SectionInformative";
import SummaryValue from "./SummaryValue";
import { useTranslation } from "react-i18next";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import { getAccountName } from "@ledgerhq/live-common/lib/account";
import type { TokenCurrency, CryptoCurrency } from "@ledgerhq/live-common/lib/types";
import SummarySection from "./SummarySection";
import { useDispatch } from "react-redux";
import { openModal } from "~/renderer/actions/modals";

import type { SwapSelectorStateType } from "~/renderer/screens/exchange/Swap2/utils/shared/useSwapTransaction";

const AccountSection = ({
  account,
  currency,
}: {
  account: $PropertyType<SwapSelectorStateType, "account">,
  currency: TokenCurrency | CryptoCurrency,
}) => {
  const { t } = useTranslation();
  const accountName = getAccountName(account);

  return (
    <SummarySection>
      <SummaryLabel label={t("swap2.form.details.label.target")} />
      <SummaryValue value={accountName} handleChange={() => {}}>
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
};
const SectionTarget = ({ account, currency }: SectionTargetProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const handleAddAccount = () => dispatch(openModal("MODAL_ADD_ACCOUNTS", { currency }));

  if (!currency) return <PlaceholderSection />;
  if (!account)
    return (
      <SectionInformative
        onClick={handleAddAccount}
        ctaLabel={t("swap2.form.details.noAccountCTA")}
        message={t("swap2.form.details.noAccount", { name: currency.name })}
      />
    );

  return <AccountSection account={account} currency={currency} />;
};

export default SectionTarget;

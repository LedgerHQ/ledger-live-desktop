import { Dropdown } from "@ledgerhq/react-ui";
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useRefreshAccountsOrdering } from "~/renderer/actions/general";
import { saveSettings } from "~/renderer/actions/settings";
import Track from "~/renderer/analytics/Track";
import { getOrderAccounts } from "~/renderer/reducers/settings";

export default function Order() {
  const orderAccounts = useSelector(getOrderAccounts);
  const refreshAccountsOrdering = useRefreshAccountsOrdering();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const onChange = useCallback(
    ({ value: sort }) => {
      if (!sort) return;
      dispatch(saveSettings({ orderAccounts: sort }));
      refreshAccountsOrdering();
    },
    [refreshAccountsOrdering, dispatch],
  );

  const items = useMemo(
    () =>
      ["balance|desc", "balance|asc", "name|asc", "name|desc"].map(value => ({
        value,
        label: t(`accounts.order.${value}`),
      })),
    [t],
  );

  const value = items.find(item => item.value === orderAccounts);

  return (
    <>
      <Dropdown label={t("common.sortBy")} value={value} options={items} onChange={onChange} />
      {value ? <Track onUpdate event="ChangeSort" orderAccounts={orderAccounts} /> : null}
    </>
  );
}

import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { matchPath, useHistory, useLocation } from "react-router-dom";
import {
  listSubAccounts,
  findSubAccountById,
  getAccountName,
} from "@ledgerhq/live-common/lib/account";
import { accountsSelector } from "~/renderer/reducers/accounts";
import { setTrackingSource } from "~/renderer/analytics/TrackPage";
import { Breadcrumb } from "@ledgerhq/react-ui";

const AccountCrumb = () => {
  const { t } = useTranslation();
  const accounts = useSelector(accountsSelector);
  const history = useHistory();

  const location = useLocation();

  const accountMatch = matchPath<{ id: string }>(location.pathname, { path: "/account/:id" });
  const subAccountMatch = matchPath<{ id: string; parentId: string }>(location.pathname, {
    path: "/account/:parentId/:id/",
  });

  const id = subAccountMatch?.params?.id ?? accountMatch?.params?.id;
  const parentId = subAccountMatch?.params?.parentId;

  const mapAccountToItem = useCallback(
    account => ({ label: getAccountName(account), value: account.id }),
    [],
  );

  const segments = useMemo(() => {
    let items = [];

    items.push({ label: t("accounts.title"), value: "accounts" }); // left-most item of breadcrumb, always present

    if (id) {
      if (parentId) {
        const parentAccount = accounts.find(a => a.id === parentId);
        const subAccount = parentAccount ? findSubAccountById(parentAccount, id) : null;

        if (parentAccount) {
          const options = accounts.map(mapAccountToItem);
          items.push({ value: mapAccountToItem(parentAccount), options });
          if (subAccount) {
            const options = listSubAccounts(parentAccount).map(mapAccountToItem);
            items.push({ value: mapAccountToItem(subAccount), options });
          }
        }
      } else {
        const account = accounts.find(a => a.id === id);
        const options = accounts.map(mapAccountToItem);
        items.push({ value: mapAccountToItem(account), options });
      }
    }

    return items;
  }, [accounts, id, parentId]);

  const handleOnChange = useCallback(
    values => {
      setTrackingSource("account breadcrumb");
      if (values.length === 1) {
        // clicked at the root of the breadcrumb (accounts link)
        history.push({ pathname: `/accounts` });
      } else if (values.length === 2) {
        // clicked on a currency account
        const accountId = values[1];
        history.push({ pathname: `/account/${accountId}` });
      } else if (values.length === 3) {
        // clicked on a sub account
        const parentAccountId = values[1];
        const subAccountId = values[2];

        history.push({ pathname: `/account/${parentAccountId}/${subAccountId}` });
      }
    },
    [history],
  );

  return <Breadcrumb onChange={handleOnChange} segments={segments} />;
};

export default AccountCrumb;

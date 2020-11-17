// @flow
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import Box from "~/renderer/components/Box";
import { useHistory, useParams } from "react-router-dom";
import {
  listSubAccounts,
  getAccountCurrency,
  findSubAccountById,
  getAccountName,
} from "@ledgerhq/live-common/lib/account";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types";
import { accountsSelector } from "~/renderer/reducers/accounts";
import IconCheck from "~/renderer/icons/Check";
import IconAngleDown from "~/renderer/icons/AngleDown";
import IconAngleUp from "~/renderer/icons/AngleUp";
import DropDownSelector from "~/renderer/components/DropDownSelector";
import Button from "~/renderer/components/Button";
import Ellipsis from "~/renderer/components/Ellipsis";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import { Separator, Item, TextLink, AngleDown, Check } from "./common";

const AccountCrumb = () => {
  const { t } = useTranslation();
  const accounts = useSelector(accountsSelector);
  const history = useHistory();
  const { parentId, id } = useParams();

  const account: ?Account = useMemo(
    () => (parentId ? accounts.find(a => a.id === parentId) : accounts.find(a => a.id === id)),
    [parentId, accounts, id],
  );

  const tokenAccount: ?AccountLike = useMemo(
    () => (parentId && account && id ? findSubAccountById(account, id) : null),
    [parentId, account, id],
  );

  const currency = useMemo(
    () =>
      tokenAccount
        ? getAccountCurrency(tokenAccount)
        : account
        ? getAccountCurrency(account)
        : null,
    [tokenAccount, account],
  );

  const items = useMemo(() => (parentId && account ? listSubAccounts(account) : accounts), [
    parentId,
    account,
    accounts,
  ]);

  const renderItem = useCallback(({ item, isActive }) => {
    const currency = getAccountCurrency(item.account);

    return (
      <Item key={item.key} isActive={isActive}>
        <CryptoCurrencyIcon size={16} currency={currency} />
        <Ellipsis ff={`Inter|${isActive ? "SemiBold" : "Regular"}`} fontSize={4}>
          {getAccountName(item.account)}
        </Ellipsis>
        {isActive && (
          <Check>
            <IconCheck size={14} />
          </Check>
        )}
      </Item>
    );
  }, []);

  const onAccountSelected = useCallback(
    item => {
      if (!item) {
        return;
      }

      if (parentId) {
        history.push({
          pathname: `/account/${parentId}/${item.key}`,
          state: { source: "account breadcrumb" },
        });
      } else {
        history.push({
          pathname: `/account/${item.key}`,
          state: { source: "account breadcrumb" },
        });
      }
    },
    [parentId, history],
  );

  const openActiveAccount = useCallback(
    (e: SyntheticEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (parentId) {
        if (id) {
          history.push({
            pathname: `/account/${parentId}/${id}`,
            state: { source: "account breadcrumb" },
          });
        }
      } else {
        if (id) {
          history.push({
            pathname: `/account/${id}`,
            state: { source: "account breadcrumb" },
          });
        }
      }
    },
    [history, parentId, id],
  );

  const processItemsForDropdown = useCallback(
    (items: any[]) =>
      items.map(item => ({ key: item.id, label: getAccountName(item), account: item })),
    [],
  );

  const processedItems = useMemo(() => processItemsForDropdown(items || []), [
    items,
    processItemsForDropdown,
  ]);

  if (!id) {
    return (
      <TextLink>
        <Button
          onClick={() =>
            history.push({
              pathname: "/accounts/",
              state: { source: "account breadcrumb" },
            })
          }
        >
          {t("accounts.title")}
        </Button>
      </TextLink>
    );
  }

  return (
    <>
      <Separator />
      <DropDownSelector
        border
        horizontal
        items={processedItems}
        renderItem={renderItem}
        onChange={onAccountSelected}
        controlled
        value={processedItems.find(a => a.key === id)}
      >
        {({ isOpen, value }) =>
          value ? (
            <Box flex={1} shrink={!!parentId} horizontal>
              <TextLink shrink>
                {currency && <CryptoCurrencyIcon size={14} currency={currency} />}
                <Button onClick={openActiveAccount}>
                  <Ellipsis>{value.label}</Ellipsis>
                </Button>
                <AngleDown>
                  {isOpen ? <IconAngleUp size={16} /> : <IconAngleDown size={16} />}
                </AngleDown>
              </TextLink>
            </Box>
          ) : null
        }
      </DropDownSelector>
    </>
  );
};

export default AccountCrumb;

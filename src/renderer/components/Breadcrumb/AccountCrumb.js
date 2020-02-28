// @flow
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
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
import DropDown from "~/renderer/components/DropDown";
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

  const name = useMemo(
    () => (tokenAccount ? getAccountName(tokenAccount) : account ? getAccountName(account) : null),
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
      <Item key={item.account.id} isActive={isActive}>
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
    ({ selectedItem: item }) => {
      if (!item) {
        return null;
      }

      const {
        account: { id },
      } = item;

      if (parentId) {
        history.push(`/account/${parentId}/${id}`);
      } else {
        history.push(`/account/${id}`);
      }
    },
    [parentId, history],
  );

  const openActiveAccount = useCallback(
    (e: SyntheticEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (parentId) {
        if (id) {
          history.push(`/account/${parentId}/${id}`);
        }
      } else {
        if (id) {
          history.push(`/account/${id}`);
        }
      }
    },
    [history, parentId, id],
  );

  const processItemsForDropdown = useCallback(
    (items: any[]) => items.map(item => ({ key: item.id, label: item.id, account: item })),
    [],
  );

  const processedItems = useMemo(() => processItemsForDropdown(items || []), [
    items,
    processItemsForDropdown,
  ]);

  if (!id) {
    return (
      <TextLink>
        <Button onClick={() => history.push("/accounts/")}>{t("accounts.title")}</Button>
      </TextLink>
    );
  }

  return (
    <>
      <Separator />
      <DropDown
        flex={1}
        shrink={parentId ? "0" : "1"}
        offsetTop={0}
        border
        horizontal
        items={processedItems}
        renderItem={renderItem}
        onStateChange={onAccountSelected}
        value={processedItems.find(a => a.key === id)}
      >
        <TextLink {...{ shrink: !parentId }}>
          {currency && <CryptoCurrencyIcon size={14} currency={currency} />}
          <Button onClick={openActiveAccount}>{name}</Button>
          <AngleDown>
            <IconAngleDown size={16} />
          </AngleDown>
        </TextLink>
      </DropDown>
    </>
  );
};

export default AccountCrumb;

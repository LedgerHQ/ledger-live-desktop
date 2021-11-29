import React, { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Account, AccountLikeArray, TokenAccount } from "@ledgerhq/live-common/lib/types";
import { PortfolioRange } from "@ledgerhq/live-common/lib/portfolio/v2/types";
import Text from "~/renderer/components/Text";
import { GenericBox } from "../index";
import SearchBox from "./SearchBox";
import DisplayOptions from "./DisplayOptions";
import GridBody from "./GridBody";
import ListBody from "./ListBody";
import { matchesSearch } from "./matchesSearch";
import FlexBox from "@ledgerhq/react-ui/components/layout/Flex";

type Props = {
  accounts: AccountLikeArray;
  mode: any;
  onAccountClick: (arg1: Account | TokenAccount, arg2: Account) => void;
  range: PortfolioRange;
};

export default function AccountList({ accounts, range, onAccountClick, mode }: Props) {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");

  const lookupParentAccount = useCallback(
    (id: string): Account => {
      for (const a of accounts) {
        if (a.type === "Account" && a.id === id) {
          return a;
        }
      }
      return null;
    },
    [accounts],
  );

  const onTextChange = useCallback((value: string) => {
    setSearch(value);
  }, []);
  const Body = BodyByMode[mode];

  const visibleAccounts = [];
  const hiddenAccounts = [];
  for (let i = 0; i < accounts.length; i++) {
    const account = accounts[i];
    if (matchesSearch(search, account, mode === "list")) {
      visibleAccounts.push(account);
    } else {
      hiddenAccounts.push(account);
    }
  }

  return (
    <div style={{ paddingBottom: 70 }}>
      <FlexBox
        flexDirection="row"
        paddingX={12}
        paddingY={7}
        alignItems="center"
        justifyContent="space-between"
      >
        <SearchBox
          id={"accounts-search-input"}
          autoFocus
          onTextChange={onTextChange}
          search={search}
        />
        <DisplayOptions />
      </FlexBox>
      {visibleAccounts.length === 0 ? (
        <Text style={{ display: "block", padding: 60, textAlign: "center" }}>
          {t("accounts.noResultFound")}
        </Text>
      ) : null}
      <Body
        horizontal
        data-e2e="dashboard_AccountList"
        range={range}
        search={search}
        visibleAccounts={visibleAccounts}
        hiddenAccounts={hiddenAccounts}
        showNewAccount={!search}
        onAccountClick={onAccountClick}
        lookupParentAccount={lookupParentAccount}
      />
    </div>
  );
}

const BodyByMode = {
  card: GridBody,
  list: ListBody,
};

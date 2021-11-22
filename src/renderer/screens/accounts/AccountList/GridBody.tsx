import React from "react";
import styled from "styled-components";
import { Account, TokenAccount } from "@ledgerhq/live-common/lib/types";
import { PortfolioRange } from "@ledgerhq/live-common/lib/portfolio/v2/types";
import { Grid, Cell } from "@ledgerhq/react-ui";
import Box from "~/renderer/components/Box";
import { ThemedComponent } from "~/renderer/styles/StyleProvider";
import AccountCard from "../AccountGridItem";
import AccountCardPlaceholder from "../AccountGridItem/Placeholder";


const GridBox: ThemedComponent<{}> = styled(Grid).attrs(() => ({
  gridTemplateColumns: "repeat(auto-fill, minmax(257px, 1fr))",
  paddingRight: 5,
}))`
  border-top: 1px solid ${p => p.theme.colors.palette.neutral.c40};
`;

type Props = {
  visibleAccounts: (Account | TokenAccount)[];
  hiddenAccounts: (Account | TokenAccount)[];
  onAccountClick: (arg1: Account | TokenAccount) => void;
  lookupParentAccount: (id: string) => Account;
  range: PortfolioRange;
  showNewAccount: boolean;
};

export default function GridBody({
  visibleAccounts,
  hiddenAccounts,
  range,
  showNewAccount,
  onAccountClick,
  lookupParentAccount,
  ...rest
}: Props) {
  return (
    <GridBox {...rest}>
      {[
        ...visibleAccounts,
        ...(showNewAccount ? [null] : []),
        ...hiddenAccounts,
      ].map((account, i) =>
        !account ? (
          <AccountCardPlaceholder key="placeholder" />
        ) : (
          <AccountCard
            hidden={i >= visibleAccounts.length}
            key={account.id}
            account={account}
            parentAccount={
              account.type !== "Account" ? lookupParentAccount(account.parentId) : null
            }
            range={range}
            onClick={onAccountClick}
          />
        ),
      )}
    </GridBox>
  );
}

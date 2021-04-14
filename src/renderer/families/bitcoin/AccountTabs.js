// @flow
import React, { memo } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";
import type { Account, Address } from "@ledgerhq/live-common/lib/types";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import OperationsList from "~/renderer/components/OperationsList";
import { SplitAddress } from "~/renderer/components/OperationsList/AddressCell";
import Tabs from "~/renderer/components/Tabs";

import TableContainer, { HeaderWrapper, TableRow } from "~/renderer/components/TableContainer";
import Box from "~/renderer/components/Box/Box";
import Button from "~/renderer/components/Button";

export const TableLine: ThemedComponent<{}> = styled(Box).attrs(() => ({
  ff: "Inter|SemiBold",
  color: "palette.text.shade60",
  horizontal: true,
  alignItems: "center",
  justifyContent: "flex-start",
  fontSize: 3,
  flex: 1.125,
  pr: 2,
}))`
  box-sizing: border-box;
  &:last-child {
    justify-content: flex-end;
    flex: 0.5;
    text-align: right;
    white-space: nowrap;
  }
`;

export const Cell: ThemedComponent<{ px?: number }> = styled(Box).attrs(p => ({
  px: p.px === 0 ? p.px : p.px || 4,
  horizontal: true,
  alignItems: "center",
  flex: 1.125,
}))`
  flex-grow: 1;
  flex-shrink: 1;
  display: block;
`;

type Props = {
  account: Account,
  parentAccount?: Account,
};

function AddressesTab({ freshAddresses }: { freshAddresses: Address[] }) {
  const { t } = useTranslation();

  return (
    <TableContainer>
      <HeaderWrapper>
        <TableLine>{t("account.address")}</TableLine>
        <TableLine>{t("account.transaction")}</TableLine>
      </HeaderWrapper>
      {freshAddresses.map(({ address }, i) => (
        <TableRow key={address + i}>
          <Cell>
            <SplitAddress color="palette.text.shade80" ff="Inter" fontSize={3} value={address} />
          </Cell>
          <Button
            onClick={() => {
              // @TODO receive on this address
            }}
          >
            {t("accounts.contextMenu.receive")}
          </Button>
        </TableRow>
      ))}
    </TableContainer>
  );
}

function AccountTabs({ account, parentAccount }: Props) {
  const { t } = useTranslation();

  const freshAddresses = account.freshAddresses || [];

  return freshAddresses.length > 0 ? (
    <Tabs
      tabs={[
        {
          label: t("account.lastOperations"),
          content: <OperationsList account={account} parentAccount={parentAccount} />,
        },
        {
          label: t("account.addresses"),
          content: <AddressesTab freshAddresses={freshAddresses} />,
        },
      ]}
    />
  ) : (
    <OperationsList
      account={account}
      parentAccount={parentAccount}
      title={t("account.lastOperations")}
    />
  );
}

export default memo<Props>(AccountTabs);

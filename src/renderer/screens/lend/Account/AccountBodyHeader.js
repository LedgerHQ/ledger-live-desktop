// @flow
import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { Trans } from "react-i18next";
import styled from "styled-components";
import type { TokenAccount, Account } from "@ledgerhq/live-common/lib/types";

import {
  makeCompoundSummaryForAccount,
  getAccountCapabilities,
} from "@ledgerhq/live-common/lib/compound/logic";
import { getAccountCurrency } from "@ledgerhq/live-common/lib/account";

import { openModal } from "~/renderer/actions/modals";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import Box, { Card } from "~/renderer/components/Box";
import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";
import Header from "./Header";
import { RowOpened, RowClosed } from "./Row";

import { urls } from "~/config/urls";
import { openURL } from "~/renderer/linking";

type Props = {
  account: TokenAccount,
  parentAccount: Account,
};

const Wrapper = styled(Box).attrs(() => ({
  p: 3,
  mt: 24,
  mb: 6,
}))`
  border: 1px dashed ${p => p.theme.colors.palette.text.shade20};
  border-radius: 4px;
  justify-content: space-between;
  align-items: center;
`;

const Loans = ({ account, parentAccount }: Props) => {
  const dispatch = useDispatch();
  const currency = getAccountCurrency(account);

  const summary = makeCompoundSummaryForAccount(account, parentAccount);
  const capabilities = getAccountCapabilities(account);
  const lendingDisabled = false;

  const onLending = useCallback(() => {
    const modal =
      capabilities && capabilities.enabledAmount.gt(0)
        ? "MODAL_LEND_SUPPLY"
        : "MODAL_LEND_ENABLE_INFO";
    const nextModal = [modal, { account, parentAccount, currency }];
    dispatch(openModal(...nextModal));
  }, [dispatch, account, parentAccount, currency, capabilities]);

  const openSupportLink = useCallback(() => openURL(urls.compound), []);

  return (
    <>
      <Box horizontal alignItems="center" justifyContent="space-between">
        <Text
          ff="Inter|Medium"
          fontSize={6}
          color="palette.text.shade100"
          data-e2e="title_Delegation"
        >
          <Trans i18nKey="lend.account.openLoans" />
        </Text>
      </Box>
      {summary && summary.opened.length > 0 ? (
        <Card p={0} mt={24} mb={6}>
          <Header type="open" />
          {summary
            ? summary.opened.map((opened, index) => (
                <RowOpened key={index} account={account} opened={opened} />
              ))
            : null}
        </Card>
      ) : (
        <Wrapper horizontal>
          <Box style={{ maxWidth: "65%" }}>
            <Text ff="Inter|Medium|SemiBold" color="palette.text.shade60" fontSize={4}>
              <Trans i18nKey={"lend.account.info"} values={{ currency: currency.name }} />
            </Text>
            <Box mt={2}>
              <LinkWithExternalIcon
                label={<Trans i18nKey="lend.account.howCompoundWorks" />}
                onClick={openSupportLink}
              />
            </Box>
          </Box>
          <Box>
            <Button primary small disabled={lendingDisabled} onClick={onLending}>
              <Trans i18nKey={"lend.account.lend"} values={{ currency: currency.name }} />
            </Button>
          </Box>
        </Wrapper>
      )}
      {summary && summary.closed.length > 0 ? (
        <>
          <Box horizontal alignItems="center" justifyContent="space-between">
            <Text
              ff="Inter|Medium"
              fontSize={6}
              color="palette.text.shade100"
              data-e2e="title_Delegation"
            >
              <Trans i18nKey="lend.account.closedLoans" />
            </Text>
          </Box>
          <Card p={0} mt={24} mb={6}>
            <Header type="close" />
            {summary
              ? summary.closed.map((closed, index) => (
                  <RowClosed key={index} account={account} closed={closed} />
                ))
              : null}
          </Card>
        </>
      ) : null}
    </>
  );
};

const AccountBodyHeader = ({ account, parentAccount }: Props) => {
  if (account.balance.isZero()) return null;

  return <Loans account={account} parentAccount={parentAccount} />;
};

export default AccountBodyHeader;

// @flow
import React, { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Trans } from "react-i18next";
import styled from "styled-components";
import type { TokenAccount, Account } from "@ledgerhq/live-common/lib/types";

import { makeCompoundSummaryForAccount } from "@ledgerhq/live-common/lib/compound/logic";
import { getAccountUnit, getAccountCurrency } from "@ledgerhq/live-common/lib/account";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";

import { openModal } from "~/renderer/actions/modals";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import Box, { Card } from "~/renderer/components/Box";
import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";
import Header from "./Header";
import Row from "./Row";

import moment from "moment";
import { useDiscreetMode } from "~/renderer/components/Discreet";
import { localeSelector } from "~/renderer/reducers/settings";

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
  const locale = useSelector(localeSelector);
  const unit = getAccountUnit(account);
  const discreet = useDiscreetMode();
  const currency = getAccountCurrency(account);

  const formatConfig = useMemo(
    () => ({
      disableRounding: false,
      alwaysShowSign: false,
      showCode: true,
      discreet,
      locale,
    }),
    [discreet, locale],
  );

  const summary = makeCompoundSummaryForAccount(account, parentAccount);
  const lendingDisabled = false;

  const onLending = useCallback(() => {
    dispatch(
      openModal("MODAL_LEND_HIGH_FEES", {
        nextModal: ["MODAL_LEND_ENABLE_INFO", { account, parentAccount, currency }],
      }),
    );
  }, [dispatch, account, parentAccount, currency]);

  const formattedClosedLoans = useMemo(
    () =>
      summary
        ? summary.closed.map(({ endDate, amountSupplied, interestsEarned }) => ({
            amountRedeemed: formatCurrencyUnit(
              unit,
              amountSupplied.plus(interestsEarned),
              formatConfig,
            ),
            interestEarned: formatCurrencyUnit(unit, interestsEarned, formatConfig),
            date: moment(endDate).format(),
          }))
        : [],
    [summary, formatConfig, unit],
  );

  const formattedOpenLoans = useMemo(
    () =>
      summary
        ? summary.opened.map(({ startingDate, amountSupplied, interestsEarned }) => ({
            amountRedeemed: formatCurrencyUnit(unit, amountSupplied, formatConfig),
            interestEarned: formatCurrencyUnit(unit, interestsEarned, formatConfig),
            date: moment(startingDate).fromNow(),
          }))
        : [],
    [formatConfig, summary, unit],
  );

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
      {formattedOpenLoans.length > 0 ? (
        <Card p={0} mt={24} mb={6}>
          <Header type="open" />
          {formattedOpenLoans.map(({ amountRedeemed, interestEarned, date }, index) => (
            <Row
              key={index}
              amountRedeemed={amountRedeemed}
              interestEarned={interestEarned}
              date={date}
            />
          ))}
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
                onClick={() => {
                  // @TODO replace with correct support URL
                  // openURL(urls.compound);
                }}
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
      {formattedClosedLoans.length > 0 ? (
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
            {formattedClosedLoans.map(({ amountRedeemed, interestEarned, date }, index) => (
              <Row
                key={index}
                amountRedeemed={amountRedeemed}
                interestEarned={interestEarned}
                date={date}
              />
            ))}
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

// @flow
import React, { useMemo } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import type { OpenedLoan, ClosedLoan } from "@ledgerhq/live-common/lib/compound/types";
import type { TokenAccount } from "@ledgerhq/live-common/lib/types";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import { TableLine } from "./Header";
import Discreet, { useDiscreetMode } from "~/renderer/components/Discreet";
import { localeSelector } from "~/renderer/reducers/settings";
import FormattedDate from "~/renderer/components/FormattedDate";

const Wrapper: ThemedComponent<*> = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 16px 20px;
`;

const Column: ThemedComponent<{ clickable?: boolean }> = styled(TableLine).attrs(p => ({
  ff: "Inter|SemiBold",
  color: p.strong ? "palette.text.shade100" : "palette.text.shade80",
  fontSize: 3,
}))`
  cursor: ${p => (p.clickable ? "pointer" : "cursor")};
`;

type OpenedProps = {
  opened: OpenedLoan,
  account: TokenAccount,
};

export const RowOpened = ({ opened, account }: OpenedProps) => {
  const locale = useSelector(localeSelector);
  const unit = getAccountUnit(account);
  const discreet = useDiscreetMode();

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

  const amountRedeemed = useMemo(
    () => formatCurrencyUnit(unit, opened.amountSupplied, formatConfig),
    [unit, opened.amountSupplied, formatConfig],
  );

  const interestEarned = useMemo(
    () => formatCurrencyUnit(unit, opened.interestsEarned, formatConfig),
    [unit, opened.interestsEarned, formatConfig],
  );

  return (
    <Wrapper>
      <Column>
        <Discreet>{amountRedeemed}</Discreet>
      </Column>
      <Column>
        <Discreet>{interestEarned}</Discreet>
      </Column>
      <Column>
        <FormattedDate date={opened.startingDate} format="L" />
      </Column>
    </Wrapper>
  );
};

type ClosedProps = {
  closed: ClosedLoan,
  account: TokenAccount,
};

export const RowClosed = ({ closed, account }: ClosedProps) => {
  const locale = useSelector(localeSelector);
  const unit = getAccountUnit(account);
  const discreet = useDiscreetMode();

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

  const amountRedeemed = useMemo(
    () =>
      formatCurrencyUnit(unit, closed.amountSupplied.plus(closed.interestsEarned), formatConfig),
    [unit, closed, formatConfig],
  );

  const interestEarned = useMemo(
    () => formatCurrencyUnit(unit, closed.interestsEarned, formatConfig),
    [unit, closed, formatConfig],
  );

  return (
    <Wrapper>
      <Column>
        <Discreet>{amountRedeemed}</Discreet>
      </Column>
      <Column>
        <Discreet>{interestEarned}</Discreet>
      </Column>
      <Column>
        <FormattedDate date={closed.endDate} format="L" />
      </Column>
    </Wrapper>
  );
};

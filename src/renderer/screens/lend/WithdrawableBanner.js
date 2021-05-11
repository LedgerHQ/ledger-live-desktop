// @flow
import React from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";
import type { Account, TokenAccount } from "@ledgerhq/live-common/lib/types";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import { makeCompoundSummaryForAccount } from "@ledgerhq/live-common/lib/compound/logic";
import { urls } from "~/config/urls";

import Alert from "~/renderer/components/Alert";
import FormattedVal from "~/renderer/components/FormattedVal";

// FormattedVal is a div, we want to avoid having it on a second line
const TextContent = styled.div`
  display: inline-flex;
`;

type Props = {
  account: TokenAccount,
  parentAccount: ?Account,
};

const WithdrawableBanner = ({ account, parentAccount }: Props) => {
  const accountUnit = getAccountUnit(account);
  const summary = makeCompoundSummaryForAccount(account);

  if (!summary) return null;

  const { totalSupplied } = summary;

  return (
    <Alert type="secondary" small learnMoreUrl={urls.compound} learnMoreOnRight>
      <TextContent>
        <Trans i18nKey="lend.withdraw.steps.amount.maxWithdrawble" />
        <FormattedVal
          style={{ width: "auto" }}
          color="palette.text.shade100"
          val={totalSupplied}
          unit={accountUnit}
          prefix=" ~"
          showCode
        />
      </TextContent>
    </Alert>
  );
};

export default WithdrawableBanner;

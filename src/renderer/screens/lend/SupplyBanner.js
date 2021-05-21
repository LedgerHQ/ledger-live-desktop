// @flow
import React from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";
import type { Account, TokenAccount } from "@ledgerhq/live-common/lib/types";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import { urls } from "~/config/urls";

import FormattedVal from "~/renderer/components/FormattedVal";
import Alert from "~/renderer/components/Alert";

// FormattedVal is a div, we want to avoid having it on a second line
const TextContent = styled.div`
  display: inline-flex;
`;

type Props = {
  account: TokenAccount,
  parentAccount: ?Account,
};

const SupplyBanner = ({ account, parentAccount }: Props) => {
  const accountUnit = getAccountUnit(account);

  return (
    <Alert type="secondary" small learnMoreUrl={urls.compound} learnMoreOnRight>
      <TextContent>
        <Trans i18nKey="lend.supply.steps.amount.maxSupply" />
        <FormattedVal
          style={{ width: "auto" }}
          color="palette.text.shade100"
          val={account.spendableBalance}
          unit={accountUnit}
          prefix=" ~"
          showCode
        />
      </TextContent>
    </Alert>
  );
};

export default SupplyBanner;

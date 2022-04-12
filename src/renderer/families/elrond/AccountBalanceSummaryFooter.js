// @flow

import React, { useState, useEffect, useMemo, useCallback } from "react";
import styled from "styled-components";
import axios from "axios";
import { BigNumber } from "bignumber.js";
import { Trans } from "react-i18next";

import { denominate } from "~/renderer/families/elrond/helpers";
import { constants } from "~/renderer/families/elrond/constants";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import Discreet from "~/renderer/components/Discreet";
import Box from "~/renderer/components/Box/Box";
import Text from "~/renderer/components/Text";
import InfoCircle from "~/renderer/icons/InfoCircle";
import ToolTip from "~/renderer/components/Tooltip";

type Props = {
  account: any,
  countervalue: any,
};

const AccountBalanceSummaryFooter = ({ account }: Props) => {
  const [delegationsResources, setDelegationResources] = useState(
    account.elrondResources.delegations || [],
  );

  const fetchDelegations = useCallback(() => {
    const fetchData = async () => {
      const delegations = await axios.get(
        `${constants.delegations}/accounts/${account.freshAddress}/delegations`,
      );

      setDelegationResources(delegations.data);
    };

    if (account.elrondResources && !account.elrondResources.delegations) {
      fetchData();
    }

    return () => setDelegationResources(account.elrondResources.delegations || []);
  }, [account]);

  const available = useMemo(() => account.spendableBalance, [account.spendableBalance]);
  const delegations = useMemo(
    () =>
      delegationsResources.reduce(
        (total, delegation) => BigNumber(delegation.userActiveStake).plus(total),
        BigNumber(0),
      ),
    [delegationsResources],
  );

  const unbondings = useMemo(
    () =>
      delegationsResources.reduce((total, item) => total.plus(item.userUnBondable), BigNumber(0)),
    [delegationsResources],
  );

  const balances = useMemo(
    () =>
      [
        {
          tooltip: "elrond.summary.availableBalanceTooltip",
          title: "elrond.summary.availableBalance",
          amount: available,
          show: true,
        },
        {
          tooltip: "elrond.summary.delegatedAssetsTooltip",
          title: "elrond.summary.delegatedAssets",
          amount: delegations,
          show: delegations.gt(0),
        },
        {
          tooltip: "elrond.summary.undelegatingTooltip",
          title: "elrond.summary.undelegating",
          amount: unbondings,
          show: unbondings.gt(0),
        },
      ].filter(balance => balance.show),
    [available, delegations, unbondings],
  );

  useEffect(fetchDelegations, [fetchDelegations]);

  return (
    <Wrapper>
      {balances.map(balance => (
        <BalanceDetail key={balance.title}>
          <ToolTip content={<Trans i18nKey={balance.tooltip} />}>
            <TitleWrapper>
              <Title>
                <Trans i18nKey={balance.title} />
              </Title>
              <InfoCircle size={13} />
            </TitleWrapper>
          </ToolTip>

          <AmountValue>
            <Discreet>
              {denominate({ input: balance.amount, showLastNonZeroDecimal: true })}{" "}
              {constants.egldLabel}
            </Discreet>
          </AmountValue>
        </BalanceDetail>
      ))}
    </Wrapper>
  );
};

const Wrapper: ThemedComponent<*> = styled(Box).attrs(() => ({
  horizontal: true,
  mt: 4,
  p: 5,
  pb: 0,
}))`
  border-top: 1px solid ${p => p.theme.colors.palette.text.shade10};
`;

const BalanceDetail = styled(Box).attrs(() => ({
  flex: "0.25 0 auto",
  vertical: true,
  alignItems: "start",
}))`
  &:nth-child(n + 3) {
    flex: 0.75;
  }
`;

const TitleWrapper = styled(Box).attrs(() => ({ horizontal: true, alignItems: "center", mb: 1 }))``;

const Title = styled(Text).attrs(() => ({
  fontSize: 4,
  ff: "Inter|Medium",
  color: "palette.text.shade60",
}))`
  line-height: ${p => p.theme.space[4]}px;
  margin-right: ${p => p.theme.space[1]}px;
`;

const AmountValue = styled(Text).attrs(() => ({
  fontSize: 6,
  ff: "Inter|SemiBold",
  color: "palette.text.shade100",
}))``;

export default AccountBalanceSummaryFooter;

// @flow

import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import { BigNumber } from "bignumber.js";
import { Trans } from "react-i18next";
import type { Account } from "@ledgerhq/live-common/lib/types";

import { denominate } from "~/renderer/families/elrond/helpers";
import { constants } from "~/renderer/families/elrond/constants";

import Discreet from "~/renderer/components/Discreet";
import InfoCircle from "~/renderer/icons/InfoCircle";
import ToolTip from "~/renderer/components/Tooltip";

import {
  Amount,
  Wrapper,
  Balance,
  Title,
  TitleWrapper,
} from "~/renderer/families/elrond/blocks/Summary";

type Props = {
  account: Account,
};

const Summary = (props: Props) => {
  const { account } = props;
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
        <Balance key={balance.title}>
          <ToolTip content={<Trans i18nKey={balance.tooltip} />}>
            <TitleWrapper>
              <Title>
                <Trans i18nKey={balance.title} />
              </Title>
              <InfoCircle size={13} />
            </TitleWrapper>
          </ToolTip>

          <Amount>
            <Discreet>
              {denominate({ input: balance.amount, showLastNonZeroDecimal: true })}{" "}
              {constants.egldLabel}
            </Discreet>
          </Amount>
        </Balance>
      ))}
    </Wrapper>
  );
};

export default Summary;

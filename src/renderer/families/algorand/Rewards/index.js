// @flow
import React, { useCallback } from "react";
import { Trans } from "react-i18next";
import { useDispatch } from "react-redux";

import type { Account } from "@ledgerhq/live-common/lib/types";
import { getAccountUnit, getAccountCurrency } from "@ledgerhq/live-common/lib/account";

import Box from "~/renderer/components/Box/Box";
import ToolTip from "~/renderer/components/Tooltip";
import FormattedVal from "~/renderer/components/FormattedVal";
import CounterValue from "~/renderer/components/CounterValue";
import Button from "~/renderer/components/Button";
import ClaimRewards from "~/renderer/icons/ClaimReward";
import { openModal } from "~/renderer/actions/modals";
import TableContainer, { TableHeader } from "~/renderer/components/TableContainer";

type Props = {
  account: Account,
};

const RewardsSection = ({ account }: Props) => {
  const { rewards } = account.algorandResources || {};
  const currency = getAccountCurrency(account);
  const unit = getAccountUnit(account);
  const dispatch = useDispatch();

  const onRewardsClick = useCallback(() => {
    dispatch(openModal("MODAL_ALGORAND_CLAIM_REWARDS", { account }));
  }, [dispatch, account]);

  const rewardsDisabled = rewards.lte(0);

  return (
    <TableContainer mb={6}>
      <TableHeader
        title={<Trans i18nKey="algorand.claimRewards.header" />}
        tooltip={<Trans i18nKey="algorand.claimRewards.tooltip" />}
        titleProps={{ "data-e2e": "title_Delegation" }}
      />
      <Box p={4} horizontal alignItems="center" justifyContent="space-between">
        <Box vertical>
          <FormattedVal
            val={rewards}
            unit={unit}
            showCode
            fontSize={5}
            disableRounding
            color="palette.text.shade100"
          />
          <CounterValue
            color="palette.text.shade60"
            fontSize={3}
            currency={currency}
            value={rewards}
            placeholder={"-"}
          />
        </Box>
        <ToolTip
          content={
            rewardsDisabled ? (
              <Trans i18nKey="algorand.claimRewards.rewardsDisabledTooltip" />
            ) : null
          }
        >
          <Button primary onClick={onRewardsClick} disabled={rewardsDisabled}>
            <Box horizontal alignItems="center" justifyContent="space-between">
              <ClaimRewards size={16} />
              &nbsp;
              <Trans i18nKey="algorand.claimRewards.cta" />
            </Box>
          </Button>
        </ToolTip>
      </Box>
    </TableContainer>
  );
};

const Rewards = ({ account }: Props) => {
  const { algorandResources } = account;

  if (!algorandResources) return null;

  return <RewardsSection account={account} />;
};

export default Rewards;

// @flow
import React, { useCallback } from "react";
import invariant from "invariant";
import { useDispatch } from "react-redux";
import { Trans } from "react-i18next";
import styled from "styled-components";
import type { Account } from "@ledgerhq/live-common/lib/types";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";
import { useCosmosPreloadData } from "@ledgerhq/live-common/lib/families/cosmos/react";

import type {
  CosmosDelegation,
  CosmosValidatorItem,
  CosmosDelegationStatus,
} from "@ledgerhq/live-common/lib/families/cosmos/types";
import type { BigNumber } from "bignumber.js";

import { urls } from "~/config/urls";
import { openURL } from "~/renderer/linking";
import { openModal } from "~/renderer/actions/modals";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import Box, { Card } from "~/renderer/components/Box";
import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";
import IconChartLine from "~/renderer/icons/ChartLine";
import Header from "./Header";
import Row from "./Row";

import ToolTip from "~/renderer/components/Tooltip";
import ClaimRewards from "~/renderer/icons/ClaimReward";
import { useDiscreetMode } from "~/renderer/components/Discreet";

/** @TODO move this in common */
const formatDelegations = (
  delegations: CosmosDelegation[],
  validators: CosmosValidatorItem[],
): {
  validator: ?CosmosValidatorItem,
  address: string,
  pendingRewards: BigNumber,
  amount: BigNumber,
  status: CosmosDelegationStatus,
}[] => {
  return delegations.map((d, i, arr) => ({
    validator: validators.find(v => v.validatorAddress === d.validatorAddress),
    address: d.validatorAddress,
    amount: d.amount,
    pendingRewards: d.pendingRewards,
    status: d.status,
  }));
};

type Props = {
  account: Account,
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

const Delegation = ({ account }: Props) => {
  const dispatch = useDispatch();

  const unit = getAccountUnit(account);

  const { validators } = useCosmosPreloadData();

  const { cosmosResources } = account;
  invariant(cosmosResources, "cosmos account expected");
  const { delegations, pendingRewardsBalance: _pendingRewardsBalance } = cosmosResources;

  const discreet = useDiscreetMode();

  const pendingRewardsBalance = formatCurrencyUnit(unit, _pendingRewardsBalance, {
    disableRounding: true,
    alwaysShowSign: false,
    showCode: true,
    discreet,
  });

  const formattedDelegations = formatDelegations(delegations, validators);

  const onEarnRewards = useCallback(() => {
    /** @TODO redirect to the cosmos info modal */
    dispatch(
      openModal("MODAL_REWARDS_COSMOS_INFO", {
        account,
      }),
    );
  }, [account, dispatch]);

  const hasDelegations = delegations.length > 0;

  const hasRewards = _pendingRewardsBalance.gt(0);

  return (
    <>
      <Box horizontal alignItems="center" justifyContent="space-between">
        <Text
          ff="Inter|Medium"
          fontSize={6}
          color="palette.text.shade100"
          data-e2e="title_Delegation"
        >
          <Trans i18nKey="cosmos.delegation.header" />
        </Text>
        {hasDelegations || hasRewards ? (
          <Box horizontal>
            {hasDelegations ? (
              <Button
                mr={2}
                primary
                small
                onClick={() => {
                  /** @TODO redirect to delegation flow */
                  //  dispatch(
                  //    openModal("MODAL_DELEGATION", {
                  //      account,
                  //      reward: pendingRewardsBalance,
                  //    }),
                  //  );
                }}
              >
                <Box horizontal flow={1} alignItems="center">
                  <ClaimRewards size={12} />
                  <Box>
                    <Trans i18nKey="cosmos.delegation.delegate" />
                  </Box>
                </Box>
              </Button>
            ) : null}
            <ToolTip content={!hasRewards ? <Trans i18nKey="cosmos.delegation.noRewards" /> : null}>
              <Button
                disabled={!hasRewards}
                primary
                small
                onClick={() => {
                  /** @TODO redirect to claim rewards flow */
                  //  dispatch(
                  //    openModal("MODAL_CLAIM_REWARDS", {
                  //      account,
                  //      reward: pendingRewardsBalance,
                  //    }),
                  //  );
                }}
              >
                <Box horizontal flow={1} alignItems="center">
                  <ClaimRewards size={12} />
                  <Box>
                    <Trans
                      i18nKey={
                        hasRewards
                          ? "cosmos.delegation.claimAvailableRewards"
                          : "cosmos.delegation.claimRewards"
                      }
                      values={{ amount: pendingRewardsBalance }}
                    />
                  </Box>
                </Box>
              </Button>
            </ToolTip>
          </Box>
        ) : null}
      </Box>
      {hasDelegations ? (
        <Card p={0} mt={24} mb={6}>
          <Header />
          {formattedDelegations.map(
            ({ validator, address, amount, pendingRewards, status }, index) => (
              <Row
                key={index}
                validator={validator}
                address={address}
                amount={amount}
                pendingRewards={pendingRewards}
                unit={unit}
                status={status}
              />
            ),
          )}
        </Card>
      ) : (
        <Wrapper horizontal>
          <Box style={{ maxWidth: "65%" }}>
            <Text ff="Inter|Medium|SemiBold" color="palette.text.shade60" fontSize={4}>
              <Trans
                i18nKey="cosmos.delegation.emptyState.description"
                values={{ name: account.currency.name }}
              />
            </Text>
            <Box mt={2}>
              <LinkWithExternalIcon
                label={<Trans i18nKey="cosmos.delegation.emptyState.info" />}
                onClick={() => openURL(urls.stakingCosmos)}
              />
            </Box>
          </Box>
          <Box>
            <Button primary small onClick={onEarnRewards}>
              <Box horizontal flow={1} alignItems="center">
                <IconChartLine size={12} />
                <Box>
                  <Trans i18nKey="cosmos.delegation.emptyState.delegation" />
                </Box>
              </Box>
            </Button>
          </Box>
        </Wrapper>
      )}
    </>
  );
};

const Delegations = ({ account }: Props) => {
  if (!account.cosmosResources) return null;

  return <Delegation account={account} />;
};

export default Delegations;

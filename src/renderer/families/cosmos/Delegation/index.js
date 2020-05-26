// @flow
import React, { useCallback } from "react";
import invariant from "invariant";
import { useDispatch } from "react-redux";
import { Trans } from "react-i18next";
import styled from "styled-components";
import type { Account } from "@ledgerhq/live-common/lib/types";
import { useCosmosMappedDelegations } from "@ledgerhq/live-common/lib/families/cosmos/react";

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

  const { cosmosResources } = account;
  invariant(cosmosResources, "cosmos account expected");
  const { delegations, pendingRewardsBalance: _pendingRewardsBalance } = cosmosResources;

  const mappedDelegations = useCosmosMappedDelegations(account);

  const onEarnRewards = useCallback(() => {
    /** @TODO redirect to the cosmos info modal */
    dispatch(
      openModal("MODAL_COSMOS_REWARDS_INFO", {
        account,
      }),
    );
  }, [account, dispatch]);

  const onDelegate = useCallback(() => {
    dispatch(
      openModal("MODAL_COSMOS_DELEGATE", {
        account,
      }),
    );
  }, [account, dispatch]);

  const onClaimRewards = useCallback(() => {
    dispatch(
      openModal("MODAL_COSMOS_CLAIM_REWARDS", {
        account,
      }),
    );
  }, [account, dispatch]);

  const onRedirect = useCallback(
    (validatorAddress: string, modalName: string) => {
      dispatch(
        openModal(modalName, {
          account,
          validatorAddress,
        }),
      );
    },
    [account, dispatch],
  );

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
              <Button mr={2} primary small onClick={onDelegate}>
                <Box horizontal flow={1} alignItems="center">
                  <ClaimRewards size={12} />
                  <Box>
                    <Trans i18nKey="cosmos.delegation.delegate" />
                  </Box>
                </Box>
              </Button>
            ) : null}
            <ToolTip content={!hasRewards ? <Trans i18nKey="cosmos.delegation.noRewards" /> : null}>
              <Button disabled={!hasRewards} primary small onClick={onClaimRewards}>
                <Box horizontal flow={1} alignItems="center">
                  <ClaimRewards size={12} />
                  <Box>
                    <Trans i18nKey="cosmos.delegation.claimRewards" />
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
          {mappedDelegations.map((delegation, index) => (
            <Row key={index} delegation={delegation} onManageAction={onRedirect} />
          ))}
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

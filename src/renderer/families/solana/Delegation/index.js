// @flow
import React, { useCallback } from "react";
import invariant from "invariant";
import { useDispatch } from "react-redux";
import { Trans } from "react-i18next";
import styled from "styled-components";
import type { Account } from "@ledgerhq/live-common/lib/types";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
//import { canDelegate } from "@ledgerhq/live-common/lib/families/solana/logic";
import { getDefaultExplorerView, getAddressExplorer } from "@ledgerhq/live-common/lib/explorers";
import {
  useSolanaPreloadData,
  useSolanaStakesWithMeta,
} from "@ledgerhq/live-common/lib/families/solana/react";

import type { SolanaStakeWithMeta } from "@ledgerhq/live-common/lib/families/solana/types";

import { urls } from "~/config/urls";
import { openURL } from "~/renderer/linking";
import { openModal } from "~/renderer/actions/modals";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import Box from "~/renderer/components/Box";
import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";
import IconChartLine from "~/renderer/icons/ChartLine";
import { Header, UnbondingHeader } from "./Header";
import { Row } from "./Row";

import ToolTip from "~/renderer/components/Tooltip";
import ClaimRewards from "~/renderer/icons/ClaimReward";
import DelegateIcon from "~/renderer/icons/Delegate";
import TableContainer, { TableHeader } from "~/renderer/components/TableContainer";

type Props = {
  account: Account,
};

const Wrapper = styled(Box).attrs(() => ({
  p: 3,
}))`
  border-radius: 4px;
  justify-content: space-between;
  align-items: center;
`;

const Delegation = ({ account }: Props) => {
  const { solanaResources } = account;
  invariant(solanaResources, "solana account and resources expected");

  const dispatch = useDispatch();

  const stakesWithMeta = useSolanaStakesWithMeta(account.currency, solanaResources.stakes);

  //const delegationEnabled = canDelegate(account);
  const delegationEnabled = true;

  //const mappedDelegations = useCosmosMappedDelegations(account);

  //const { validators } = useCosmosPreloadData();
  const unit = getAccountUnit(account);

  //const mappedUnbondings = mapUnbondings(unbondings, validators, unit);

  const onEarnRewards = useCallback(() => {
    dispatch(
      openModal("MODAL_SOLANA_DELEGATE", {
        account,
      }),
    );
  }, [account, dispatch]);

  const onDelegate = useCallback(() => {
    dispatch(
      openModal("MODAL_SOLANA_DELEGATE", {
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
    (stakeWithMeta: SolanaStakeWithMeta, modalName: string) => {
      dispatch(
        openModal(modalName, {
          account,
          stakeWithMeta,
        }),
      );
    },
    [account, dispatch],
  );

  const explorerView = getDefaultExplorerView(account.currency);

  const onExternalLink = useCallback(
    (address: string) => {
      const URL = explorerView && getAddressExplorer(explorerView, address);

      if (URL) openURL(URL);
    },
    [explorerView],
  );

  const hasStakes = stakesWithMeta.length > 0;

  return (
    <>
      <TableContainer mb={6}>
        <TableHeader
          title={<Trans i18nKey="cosmos.delegation.header" />}
          titleProps={{ "data-e2e": "title_Delegation" }}
        >
          <ToolTip
            content={
              !delegationEnabled ? <Trans i18nKey="cosmos.delegation.minSafeWarning" /> : null
            }
          >
            <Button
              id={"account-delegate-button"}
              mr={2}
              disabled={!delegationEnabled}
              color="palette.primary.main"
              small
              onClick={onDelegate}
            >
              <Box horizontal flow={1} alignItems="center">
                <DelegateIcon size={12} />
                <Box>
                  <Trans i18nKey="cosmos.delegation.delegate" />
                </Box>
              </Box>
            </Button>
          </ToolTip>
        </TableHeader>
        {hasStakes ? (
          <>
            <Header />
            {stakesWithMeta.map(stakeWithMeta => (
              <Row
                stakeWithMeta={stakeWithMeta}
                key={stakeWithMeta.stake.stakeAccAddr}
                account={account}
                onManageAction={onRedirect}
                onExternalLink={onExternalLink}
              />
            ))}
          </>
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
              <ToolTip
                content={
                  !delegationEnabled ? <Trans i18nKey="cosmos.delegation.minSafeWarning" /> : null
                }
              >
                <Button primary small disabled={!delegationEnabled} onClick={onEarnRewards}>
                  <Box horizontal flow={1} alignItems="center">
                    <IconChartLine size={12} />
                    <Box>
                      <Trans i18nKey="cosmos.delegation.emptyState.delegation" />
                    </Box>
                  </Box>
                </Button>
              </ToolTip>
            </Box>
          </Wrapper>
        )}
      </TableContainer>
      {/*hasUnbondings ? (
        <TableContainer mb={6}>
          <TableHeader
            title={<Trans i18nKey="cosmos.undelegation.header" />}
            titleProps={{ "data-e2e": "title_Undelegation" }}
            tooltip={<Trans i18nKey="cosmos.undelegation.headerTooltip" />}
          />
          <UnbondingHeader />
          {mappedUnbondings.map((delegation, index) => (
            <UnbondingRow key={index} delegation={delegation} onExternalLink={onExternalLink} />
          ))}
        </TableContainer>
          ) : null*/}
    </>
  );
};

const Delegations = ({ account }: Props) => {
  if (!account.solanaResources) return null;

  return <Delegation account={account} />;
};

export default Delegations;

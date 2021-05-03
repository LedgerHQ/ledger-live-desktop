// @flow
import React, { useCallback, useMemo } from "react";
import invariant from "invariant";
import { useDispatch, useSelector } from "react-redux";
import { Trans } from "react-i18next";
import styled from "styled-components";
import type { Account } from "@ledgerhq/live-common/lib/types";

import {
  useTronSuperRepresentatives,
  getLastVotedDate,
  formatVotes,
  getNextRewardDate,
  MIN_TRANSACTION_AMOUNT,
} from "@ledgerhq/live-common/lib/families/tron/react";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";
import { getDefaultExplorerView } from "@ledgerhq/live-common/lib/explorers";

import { urls } from "~/config/urls";
import { openURL } from "~/renderer/linking";
import { openModal } from "~/renderer/actions/modals";
import Text from "~/renderer/components/Text";
import Button from "~/renderer/components/Button";
import Box from "~/renderer/components/Box";
import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";
import IconChartLine from "~/renderer/icons/ChartLine";
import Vote from "~/renderer/icons/Vote";
import Header from "./Header";
import Row from "./Row";
import Footer from "./Footer";

import { BigNumber } from "bignumber.js";
import moment from "moment";
import ToolTip from "~/renderer/components/Tooltip";
import ClaimRewards from "~/renderer/icons/ClaimReward";
import { useDiscreetMode } from "~/renderer/components/Discreet";
import { localeSelector } from "~/renderer/reducers/settings";
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
  const dispatch = useDispatch();
  const locale = useSelector(localeSelector);

  const superRepresentatives = useTronSuperRepresentatives();

  const lastVoteDate = getLastVotedDate(account);
  const duration = useMemo(() => (lastVoteDate ? moment().diff(lastVoteDate, "days") : 0), [
    lastVoteDate,
  ]);

  const unit = getAccountUnit(account);
  const explorerView = getDefaultExplorerView(account.currency);

  const formattedMinAmount = formatCurrencyUnit(unit, BigNumber(MIN_TRANSACTION_AMOUNT), {
    disableRounding: true,
    alwaysShowSign: false,
    showCode: true,
    locale,
  });

  const { tronResources, spendableBalance } = account;
  invariant(tronResources, "tron account expected");
  const { votes, tronPower, unwithdrawnReward } = tronResources;

  const discreet = useDiscreetMode();

  const formattedUnwidthDrawnReward = formatCurrencyUnit(unit, BigNumber(unwithdrawnReward || 0), {
    disableRounding: true,
    alwaysShowSign: false,
    showCode: true,
    discreet,
    locale,
  });

  const formattedVotes = formatVotes(votes, superRepresentatives);

  const totalVotesUsed = votes.reduce((sum, { voteCount }) => sum + voteCount, 0);

  const onDelegate = useCallback(
    () =>
      dispatch(
        openModal(votes.length > 0 ? "MODAL_VOTE_TRON" : "MODAL_VOTE_TRON_INFO", {
          account,
        }),
      ),
    [account, dispatch, votes],
  );

  const onEarnRewards = useCallback(
    () =>
      dispatch(
        openModal("MODAL_TRON_REWARDS_INFO", {
          account,
        }),
      ),
    [account, dispatch],
  );

  const hasVotes = formattedVotes.length > 0;

  const hasRewards = unwithdrawnReward.gt(0);

  const nextRewardDate = getNextRewardDate(account);
  const formattedNextRewardDate = useMemo(
    () => nextRewardDate && moment(nextRewardDate).fromNow(),
    [nextRewardDate],
  );
  const canClaimRewards = hasRewards && !formattedNextRewardDate;

  const earnRewardDisabled =
    tronPower === 0 && (!spendableBalance || !spendableBalance.gte(MIN_TRANSACTION_AMOUNT));

  return (
    <TableContainer mb={6}>
      <TableHeader
        title={<Trans i18nKey="tron.voting.header" />}
        titleProps={{ "data-e2e": "title_Delegation" }}
      >
        {tronPower > 0 && formattedVotes.length > 0 ? (
          <Button small color="palette.primary.main" onClick={onDelegate} mr={2}>
            <Box horizontal flow={1} alignItems="center">
              <Vote size={12} />
              <Box>
                <Trans
                  i18nKey={
                    hasVotes ? "tron.voting.emptyState.voteExisting" : "tron.voting.emptyState.vote"
                  }
                />
              </Box>
            </Box>
          </Button>
        ) : null}
        {formattedVotes.length > 0 || canClaimRewards ? (
          <ToolTip
            content={
              !canClaimRewards ? (
                hasRewards && formattedNextRewardDate ? (
                  <Trans
                    i18nKey="tron.voting.nextRewardsDate"
                    values={{ date: formattedNextRewardDate }}
                  />
                ) : (
                  <Trans i18nKey="tron.voting.noRewards" />
                )
              ) : null
            }
          >
            <Button
              disabled={!canClaimRewards}
              color="palette.primary.main"
              small
              onClick={() => {
                dispatch(
                  openModal("MODAL_CLAIM_REWARDS", {
                    account,
                    reward: unwithdrawnReward,
                  }),
                );
              }}
            >
              <Box horizontal flow={1} alignItems="center">
                <ClaimRewards size={12} />
                <Box>
                  <Trans
                    i18nKey={
                      hasRewards ? "tron.voting.claimAvailableRewards" : "tron.voting.claimRewards"
                    }
                    values={{ amount: formattedUnwidthDrawnReward }}
                  />
                </Box>
              </Box>
            </Button>
          </ToolTip>
        ) : null}
      </TableHeader>
      {tronPower > 0 && formattedVotes.length > 0 ? (
        <>
          <Header />
          {formattedVotes.map(({ validator, address, voteCount, isSR }, index) => (
            <Row
              key={index}
              validator={validator}
              address={address}
              amount={voteCount}
              isSR={isSR}
              duration={
                duration ? (
                  <Trans
                    i18nKey="delegation.durationDays"
                    count={duration}
                    values={{ count: duration }}
                  />
                ) : (
                  <Trans i18nKey="delegation.durationJustStarted" />
                )
              }
              percentTP={String(Math.round(100 * Number((voteCount * 1e2) / tronPower)) / 100)}
              currency={account.currency}
              explorerView={explorerView}
            />
          ))}
          <Footer total={tronPower} used={totalVotesUsed} onClick={onDelegate} />
        </>
      ) : (
        <Wrapper horizontal>
          <Box style={{ maxWidth: "65%" }}>
            <Text ff="Inter|Medium|SemiBold" color="palette.text.shade60" fontSize={4}>
              <Trans
                i18nKey={
                  tronPower > 0
                    ? "tron.voting.emptyState.votesDesc"
                    : "tron.voting.emptyState.description"
                }
                values={{ name: account.currency.name }}
              />
            </Text>
            <Box mt={2}>
              <LinkWithExternalIcon
                label={<Trans i18nKey="tron.voting.emptyState.info" />}
                onClick={() => openURL(urls.stakingTron)}
              />
            </Box>
          </Box>
          <Box>
            <ToolTip
              content={
                earnRewardDisabled ? (
                  <Trans
                    i18nKey="tron.voting.warnEarnRewards"
                    values={{ amount: formattedMinAmount }}
                  />
                ) : null
              }
            >
              <Button
                primary
                small
                disabled={earnRewardDisabled}
                onClick={tronPower > 0 ? onDelegate : onEarnRewards}
              >
                <Box horizontal flow={1} alignItems="center">
                  <IconChartLine size={12} />
                  <Box>
                    <Trans
                      i18nKey={tronPower > 0 ? "tron.voting.emptyState.vote" : "delegation.title"}
                    />
                  </Box>
                </Box>
              </Button>
            </ToolTip>
          </Box>
        </Wrapper>
      )}
    </TableContainer>
  );
};

const Votes = ({ account }: Props) => {
  if (!account.tronResources) return null;

  return <Delegation account={account} />;
};

export default Votes;

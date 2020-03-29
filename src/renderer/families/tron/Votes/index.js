// @flow
import React, { useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { Trans } from "react-i18next";
import styled from "styled-components";
import type { Account } from "@ledgerhq/live-common/lib/types";

import {
  useTronSuperRepresentatives,
  useNextVotingDate,
  formatVotes,
  getNextRewardDate,
} from "@ledgerhq/live-common/lib/families/tron/react";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";

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
import Footer from "./Footer";

import { BigNumber } from "bignumber.js";
import moment from "moment";
import ToolTip from "~/renderer/components/Tooltip";
import ClaimRewards from "~/renderer/icons/ClaimReward";

type Props = {
  account: Account,
  parentAccount: ?Account,
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

const Delegation = ({ account, parentAccount }: Props) => {
  const dispatch = useDispatch();

  const superRepresentatives = useTronSuperRepresentatives();
  const nextVotingDate = useNextVotingDate();

  const formattedVotingDate = useMemo(() => moment(nextVotingDate).fromNow(), [nextVotingDate]);

  const unit = getAccountUnit(account);
  /** min 1TRX transactions */
  const minAmount = 10 ** unit.magnitude;

  const { tronResources, spendableBalance } = account;
  const { votes, tronPower, unwithdrawnReward } = tronResources || {};

  const formattedUnwidthDrawnReward = formatCurrencyUnit(
    account.unit,
    BigNumber(unwithdrawnReward || 0),
    {
      disableRounding: true,
      alwaysShowSign: false,
      showCode: true,
    },
  );

  const formattedVotes = formatVotes(votes, superRepresentatives);

  const totalVotesUsed = votes.reduce((sum, { voteCount }) => sum + voteCount, 0);

  const onDelegate = useCallback(
    () =>
      dispatch(
        openModal("MODAL_DELEGATE_TRON", {
          parentAccount,
          account,
        }),
      ),
    [account, parentAccount, dispatch],
  );

  const onEarnRewards = useCallback(
    () =>
      dispatch(
        openModal("MODAL_REWARDS_INFO", {
          parentAccount,
          account,
        }),
      ),
    [account, parentAccount, dispatch],
  );

  const hasRewards = unwithdrawnReward > 0;
  const nextRewardDate = getNextRewardDate(account);
  const formattedNextRewardDate = useMemo(
    () => nextRewardDate && moment(nextRewardDate).fromNow(),
    [nextRewardDate],
  );
  const canClaimRewards = hasRewards && !formattedNextRewardDate;

  const earnRewardDisabled =
    tronPower === 0 && (!spendableBalance || !spendableBalance.gt(minAmount));

  return (
    <>
      <Box horizontal alignItems="center" justifyContent="space-between">
        <Text
          ff="Inter|Medium"
          fontSize={6}
          color="palette.text.shade100"
          data-e2e="title_Delegation"
        >
          <Trans i18nKey="tron.voting.header" />
        </Text>
        {tronPower > 0 && (formattedVotes.length > 0 || canClaimRewards) ? (
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
              primary
              onClick={() => {
                dispatch(
                  openModal("MODAL_CLAIM_REWARDS", {
                    parentAccount,
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
      </Box>
      {tronPower > 0 && formattedVotes.length > 0 ? (
        <Card p={0} mt={24} mb={6}>
          <Header />
          {formattedVotes.map(({ validator, address, voteCount }, index) => (
            <Row
              key={index}
              validator={validator}
              address={address}
              amount={voteCount}
              duration={formattedVotingDate}
              percentTP={Number((voteCount * 1e2) / tronPower).toFixed(2)}
              currency={account.currency}
            />
          ))}
          <Footer total={tronPower} used={totalVotesUsed} onClick={onDelegate} />
        </Card>
      ) : (
        <Wrapper horizontal>
          <Box style={{ maxWidth: "65%" }}>
            <Text ff="Inter|Medium|SemiBold" color="palette.text.shade60" fontSize={4}>
              <Trans i18nKey="delegation.delegationEarn" values={{ name: account.currency.name }} />
            </Text>
            <Box mt={2}>
              <LinkWithExternalIcon
                label={<Trans i18nKey="delegation.howItWorks" />}
                onClick={() => openURL(urls.delegation)}
              />
            </Box>
          </Box>
          <Box>
            <ToolTip
              content={earnRewardDisabled ? <Trans i18nKey="tron.voting.warnEarnRewards" /> : null}
            >
              <Button primary disabled={earnRewardDisabled} onClick={onEarnRewards}>
                <Box horizontal flow={1} alignItems="center">
                  <IconChartLine size={12} />
                  <Box>
                    <Trans i18nKey="delegation.title" />
                  </Box>
                </Box>
              </Button>
            </ToolTip>
          </Box>
        </Wrapper>
      )}
    </>
  );
};

const Votes = ({ account, parentAccount }: Props) => {
  if (!account.tronResources) return null;

  return <Delegation account={account} parentAccount={parentAccount} />;
};

export default Votes;

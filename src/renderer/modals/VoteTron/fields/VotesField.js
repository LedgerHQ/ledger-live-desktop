// @flow
import invariant from "invariant";
import React, { useCallback, useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { Trans } from "react-i18next";
import type { TFunction } from "react-i18next";
import {
  useTronSuperRepresentatives,
  useSortedSr,
  SR_MAX_VOTES,
} from "@ledgerhq/live-common/lib/families/tron/react";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import { getDefaultExplorerView, getAddressExplorer } from "@ledgerhq/live-common/lib/explorers";
import type { Account, TransactionStatus } from "@ledgerhq/live-common/lib/types";
import type { Vote } from "@ledgerhq/live-common/lib/families/tron/types";
import { localeSelector } from "~/renderer/reducers/settings";
import { openURL } from "~/renderer/linking";
import Box from "~/renderer/components/Box";
import Trophy from "~/renderer/icons/Trophy";
import Medal from "~/renderer/icons/Medal";
import ValidatorRow, { IconContainer } from "~/renderer/components/Delegation/ValidatorRow";
import ValidatorListHeader from "~/renderer/components/Delegation/ValidatorListHeader";
import ScrollLoadingList from "~/renderer/components/ScrollLoadingList";
import ValidatorSearchInput, {
  NoResultPlaceholder,
} from "~/renderer/components/Delegation/ValidatorSearchInput";

type Props = {
  t: TFunction,
  votes: Vote[],
  account: Account,
  status: TransactionStatus,
  onChangeVotes: (updater: (Vote[]) => Vote[]) => void,
  bridgePending: boolean,
};

const AmountField = ({ t, account, onChangeVotes, status, bridgePending, votes }: Props) => {
  invariant(account, "tron account required");

  const [search, setSearch] = useState("");
  const { tronResources } = account;
  invariant(tronResources && votes, "tron transaction required");

  const locale = useSelector(localeSelector);

  const superRepresentatives = useTronSuperRepresentatives();
  const SR = useSortedSr(search, superRepresentatives, votes);

  const votesAvailable = tronResources.tronPower;
  const votesUsed = votes.reduce((sum, v) => sum + v.voteCount, 0);
  const votesSelected = votes.length;
  const max = Math.max(0, votesAvailable - votesUsed);

  const unit = getAccountUnit(account);

  const onUpdateVote = useCallback(
    (address, value) => {
      const raw = value ? parseInt(value.toString(), 10) : 0;
      const voteCount = raw <= 0 || votesSelected > SR_MAX_VOTES ? 0 : raw;
      onChangeVotes(existing => {
        const update = existing.filter(v => v.address !== address);
        if (voteCount > 0) {
          update.push({ address, voteCount });
        }
        return update;
      });
    },
    [onChangeVotes, votesSelected],
  );

  const containerRef = useRef();

  const explorerView = getDefaultExplorerView(account.currency);

  const onExternalLink = useCallback(
    (address: string) => {
      const srURL = explorerView && getAddressExplorer(explorerView, address);

      if (srURL) openURL(srURL);
    },
    [explorerView],
  );

  const onSearch = useCallback(evt => setSearch(evt.target.value), [setSearch]);

  const notEnoughVotes = votesUsed > votesAvailable;
  const maxAvailable = Math.max(0, votesAvailable - votesUsed);

  /** auto focus first input on mount */
  useEffect(() => {
    /** $FlowFixMe */
    if (containerRef && containerRef.current && containerRef.current.querySelector) {
      const firstInput = containerRef.current.querySelector("input");
      if (firstInput && firstInput.focus) firstInput.focus();
    }
  }, []);

  const renderItem = useCallback(
    ({ sr, rank, isSR }, i) => {
      const item = votes.find(v => v.address === sr.address);
      const disabled = !item && votesSelected >= SR_MAX_VOTES;
      return (
        <ValidatorRow
          key={`SR_${sr.address}_${i}`}
          validator={sr}
          icon={
            <IconContainer isSR={isSR}>
              {isSR ? <Trophy size={16} /> : <Medal size={16} />}
            </IconContainer>
          }
          title={`${rank}. ${sr.name || sr.address}`}
          subtitle={
            <Trans
              i18nKey="vote.steps.castVotes.totalVotes"
              values={{ total: sr.voteCount.toLocaleString(locale) }}
            >
              <b></b>
            </Trans>
          }
          value={item && item.voteCount}
          onUpdateVote={onUpdateVote}
          onExternalLink={onExternalLink}
          disabled={disabled}
          notEnoughVotes={notEnoughVotes}
          maxAvailable={maxAvailable}
          // dont allow for decimals
          unit={{ ...unit, magnitude: 0 }}
          shouldRenderMax={maxAvailable > 0 && !disabled}
        />
      );
    },
    [
      votes,
      locale,
      onUpdateVote,
      onExternalLink,
      notEnoughVotes,
      maxAvailable,
      votesSelected,
      unit,
    ],
  );

  if (!status) return null;
  return (
    <>
      <ValidatorSearchInput search={search} onSearch={onSearch} />
      <ValidatorListHeader
        votesSelected={votesSelected}
        votesAvailable={votesAvailable}
        max={max}
        maxVotes={SR_MAX_VOTES}
        totalValidators={SR.length}
        notEnoughVotes={notEnoughVotes}
      />
      <Box ref={containerRef}>
        <ScrollLoadingList
          data={SR}
          style={{ flex: "1 0 240px" }}
          renderItem={renderItem}
          noResultPlaceholder={SR.length <= 0 && search && <NoResultPlaceholder search={search} />}
        />
      </Box>
    </>
  );
};

export default AmountField;

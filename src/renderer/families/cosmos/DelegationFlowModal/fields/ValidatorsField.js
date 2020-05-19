// @flow
import invariant from "invariant";
import React, { useCallback, useState, useRef, useEffect, useMemo } from "react";
import { Trans } from "react-i18next";
import { BigNumber } from "bignumber.js";

import type { TFunction } from "react-i18next";
import type { Account, TransactionStatus, Unit } from "@ledgerhq/live-common/lib/types";
import type {
  CosmosDelegationInfo,
  CosmosValidatorItem,
} from "@ledgerhq/live-common/lib/families/cosmos/types";

import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import { useCosmosPreloadData } from "@ledgerhq/live-common/lib/families/cosmos/react";
import { getDefaultExplorerView, getAddressExplorer } from "@ledgerhq/live-common/lib/explorers";

import { openURL } from "~/renderer/linking";
import Box from "~/renderer/components/Box";
import ValidatorRow, { IconContainer } from "~/renderer/components/Delegation/ValidatorRow";
import ValidatorListHeader from "~/renderer/components/Delegation/ValidatorListHeader";
import ScrollLoadingList from "~/renderer/components/ScrollLoadingList";
import ValidatorSearchInput, {
  NoResultPlaceholder,
} from "~/renderer/components/Delegation/ValidatorSearchInput";
import FirstLetterIcon from "~/renderer/components/FirstLetterIcon";
import Text from "~/renderer/components/Text";

/** @TODO move this in common */
const MAX_VOTES = 5;

/** @TODO move this in common */
const formatValue = (value: BigNumber, unit: Unit): number =>
  value
    .dividedBy(10 ** unit.magnitude)
    .integerValue(BigNumber.ROUND_FLOOR)
    .toNumber();

/** @TODO move this in common */
/** Search filters for validator list */
const searchFilter = (query?: string) => ({
  name,
  address,
}: {
  name: ?string,
  address: string,
}) => {
  if (!query) return true;
  const terms = `${name || ""} ${address}`;
  return terms.toLowerCase().includes(query.toLowerCase().trim());
};

/** @TODO move this in common */
/** Hook to search and sort SR list according to initial votes and query */
export function useSortedValidators(
  search: string,
  validators: CosmosValidatorItem[],
  delegations: CosmosDelegationInfo[],
): {
  validator: CosmosValidatorItem,
  name: ?string,
  address: string,
  rank: number,
}[] {
  const { current: initialVotes } = useRef(delegations.map(({ address }) => address));

  const formattedValidators = useMemo(
    () =>
      validators.map((validator, rank) => ({
        validator,
        name: validator.name,
        address: validator.validatorAddress,
        rank: rank + 1,
      })),
    [validators],
  );

  const sortedVotes = useMemo(
    () =>
      formattedValidators
        .filter(({ address }) => initialVotes.includes(address))
        .concat(formattedValidators.filter(({ address }) => !initialVotes.includes(address))),
    [formattedValidators, initialVotes],
  );

  const sr = useMemo(
    () => (search ? formattedValidators.filter(searchFilter(search)) : sortedVotes),
    [search, formattedValidators, sortedVotes],
  );

  return sr;
}

type Props = {
  t: TFunction,
  delegations: CosmosDelegationInfo[],
  account: Account,
  status: TransactionStatus,
  onChangeDelegations: (updater: (CosmosDelegationInfo[]) => CosmosDelegationInfo[]) => void,
  bridgePending: boolean,
};

const ValidatorField = ({
  t,
  account,
  onChangeDelegations,
  status,
  bridgePending,
  delegations,
}: Props) => {
  invariant(account, "cosmos account required");

  const [search, setSearch] = useState("");
  const { cosmosResources } = account;
  invariant(cosmosResources && delegations, "cosmos transaction required");

  const unit = getAccountUnit(account);

  const { validators } = useCosmosPreloadData();
  const SR = useSortedValidators(search, validators, delegations);

  const delegationsAvailable = formatValue(
    cosmosResources.delegatedBalance.plus(account.spendableBalance),
    unit,
  );
  const delegationsUsed = delegations.reduce((sum, v) => sum + formatValue(v.amount, unit), 0);
  const delegationsSelected = delegations.length;

  const max = Math.max(0, delegationsAvailable - delegationsUsed);

  const onUpdateDelegation = useCallback(
    (address, value) => {
      const raw = value ? parseInt(value.replace(/[^0-9]/g, ""), 10) : 0;

      const amount =
        raw <= 0 || delegationsSelected > MAX_VOTES
          ? BigNumber(0)
          : BigNumber(raw).multipliedBy(10 ** unit.magnitude);

      onChangeDelegations(existing => {
        const update = existing.filter(v => v.address !== address);
        if (amount > 0) {
          update.push({ address, amount });
        }
        return update;
      });
    },
    [onChangeDelegations, delegationsSelected, unit.magnitude],
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

  const notEnoughDelegations = delegationsUsed > delegationsAvailable;

  /** auto focus first input on mount */
  useEffect(() => {
    /** $FlowFixMe */
    if (containerRef && containerRef.current && containerRef.current.querySelector) {
      const firstInput = containerRef.current.querySelector("input");
      if (firstInput && firstInput.focus) firstInput.focus();
    }
  }, []);

  const renderItem = useCallback(
    ({ validator, rank, address }, i) => {
      const item = delegations.find(v => v.address === validator.validatorAddress);
      return (
        <ValidatorRow
          key={`SR_${validator.address}_${i}`}
          validator={{ ...validator, address }}
          icon={
            <IconContainer isSR>
              <FirstLetterIcon label={validator.name || validator.address} />
            </IconContainer>
          }
          title={`${rank}. ${validator.name || validator.address}`}
          subtitle={
            <Trans
              i18nKey="cosmos.delegation.votingPower"
              values={{ amount: (validator.votingPower * 1e2).toFixed(2) }}
            />
          }
          sideInfo={
            <Box pr={1}>
              <Text textAlign="center" ff="Inter|SemiBold" fontSize={2}>
                {validator.estimatedYearlyRewardsRate
                  ? (validator.estimatedYearlyRewardsRate * 1e2).toFixed(2)
                  : "N/A"}
              </Text>
              <Text textAlign="center" fontSize={1}>
                <Trans i18nKey="cosmos.delegation.estYield" />
              </Text>
            </Box>
          }
          value={item && item.amount ? formatValue(item.amount, unit) : 0}
          onUpdateVote={onUpdateDelegation}
          onExternalLink={onExternalLink}
          disabled={!item && delegationsSelected >= MAX_VOTES}
          notEnoughVotes={notEnoughDelegations}
          maxAvailable={max}
        />
      );
    },
    [
      delegations,
      onUpdateDelegation,
      onExternalLink,
      delegationsSelected,
      notEnoughDelegations,
      max,
      unit,
    ],
  );

  if (!status) return null;
  return (
    <>
      <ValidatorSearchInput search={search} onSearch={onSearch} />
      <ValidatorListHeader
        votesSelected={delegationsSelected}
        votesAvailable={delegationsAvailable}
        max={max}
        maxVotes={MAX_VOTES}
        totalValidators={SR.length}
        notEnoughVotes={notEnoughDelegations}
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

export default ValidatorField;

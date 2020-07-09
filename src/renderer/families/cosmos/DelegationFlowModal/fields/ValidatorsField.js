// @flow
import invariant from "invariant";
import React, { useCallback, useState, useRef, useEffect } from "react";
import { Trans } from "react-i18next";
import { BigNumber } from "bignumber.js";
import type { TFunction } from "react-i18next";

import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import { getDefaultExplorerView, getAddressExplorer } from "@ledgerhq/live-common/lib/explorers";
import type { Account, TransactionStatus } from "@ledgerhq/live-common/lib/types";
import {
  useCosmosPreloadData,
  useSortedValidators,
} from "@ledgerhq/live-common/lib/families/cosmos/react";
import {
  COSMOS_MAX_DELEGATIONS,
  mapDelegations,
  getMaxDelegationAvailable,
} from "@ledgerhq/live-common/lib/families/cosmos/logic";
import type {
  CosmosDelegation,
  CosmosDelegationInfo,
  CosmosMappedValidator,
} from "@ledgerhq/live-common/lib/families/cosmos/types";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";

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

type Props = {
  t: TFunction,
  validators: CosmosDelegationInfo[],
  delegations: CosmosDelegation[],
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
  validators,
}: Props) => {
  invariant(account, "cosmos account required");

  const [search, setSearch] = useState("");
  const { cosmosResources } = account;
  invariant(cosmosResources && delegations, "cosmos transaction required");

  const unit = getAccountUnit(account);

  const formattedDelegations = delegations.map(({ validatorAddress, ...d }) => ({
    ...d,
    address: validatorAddress,
  }));

  const { validators: cosmosValidators } = useCosmosPreloadData();
  const SR = useSortedValidators(search, cosmosValidators, formattedDelegations);
  const currentDelegations = mapDelegations(delegations, cosmosValidators, unit);

  const delegationsUsed = validators.reduce((sum, v) => sum.plus(v.amount), BigNumber(0));
  const delegationsSelected = validators.length;

  const max = getMaxDelegationAvailable(account, delegationsSelected).minus(delegationsUsed);

  const onUpdateDelegation = useCallback(
    (address, value) => {
      const amount = BigNumber(value);

      onChangeDelegations(existing => {
        const update = existing.filter(v => v.address !== address);
        if (amount.gt(0)) {
          update.push({ address, amount });
        }
        return update;
      });
    },
    [onChangeDelegations],
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

  const notEnoughDelegations = max.lt(0);

  /** auto focus first input on mount */
  useEffect(() => {
    /** $FlowFixMe */
    if (containerRef && containerRef.current && containerRef.current.querySelector) {
      const firstInput = containerRef.current.querySelector("input");
      if (firstInput && firstInput.focus) firstInput.focus();
    }
  }, []);

  const renderItem = useCallback(
    ({ validator, rank }: CosmosMappedValidator, i) => {
      const item = validators.find(v => v.address === validator.validatorAddress);
      const d = currentDelegations.find(v => v.validatorAddress === validator.validatorAddress);

      const currentMax = item
        ? max
        : getMaxDelegationAvailable(account, delegationsSelected + 1).minus(delegationsUsed);

      const onMax = () =>
        onUpdateDelegation(validator.validatorAddress, item ? item.amount.plus(max) : currentMax);

      const disabled =
        !item && (currentMax.lte(0) || delegationsSelected >= COSMOS_MAX_DELEGATIONS);

      return (
        <ValidatorRow
          key={`SR_${validator.validatorAddress}_${i}`}
          validator={{ ...validator, address: validator.validatorAddress }}
          icon={
            <IconContainer isSR>
              <FirstLetterIcon label={validator.name || validator.validatorAddress} />
            </IconContainer>
          }
          title={`${rank}. ${validator.name || validator.validatorAddress}`}
          subtitle={
            d ? (
              <Trans
                i18nKey="cosmos.delegation.currentDelegation"
                values={{ amount: d.formattedAmount }}
              >
                <b style={{ marginLeft: 5 }}></b>
              </Trans>
            ) : null
          }
          sideInfo={
            <Box pr={1}>
              <Text textAlign="center" ff="Inter|SemiBold" fontSize={2}>
                {/* $FlowFixMe */}
                {validator.estimatedYearlyRewardsRate
                  ? `${(validator.estimatedYearlyRewardsRate * 1e2).toFixed(2)} %`
                  : "N/A"}
              </Text>
              <Text textAlign="center" fontSize={1}>
                <Trans i18nKey="cosmos.delegation.estYield" />
              </Text>
            </Box>
          }
          value={item && item.amount}
          onExternalLink={onExternalLink}
          notEnoughVotes={item && item.amount && max.lt(0)}
          maxAvailable={max}
          unit={unit}
          onUpdateVote={onUpdateDelegation}
          onMax={onMax}
          shouldRenderMax={currentMax.gt(0)}
          disabled={disabled}
        />
      );
    },
    [
      validators,
      onUpdateDelegation,
      onExternalLink,
      max,
      unit,
      currentDelegations,
      delegationsSelected,
      account,
      delegationsUsed,
    ],
  );

  const formatMax = max.dividedBy(10 ** unit.magnitude).toNumber();
  const formatMaxText = formatCurrencyUnit(unit, max, { showCode: true });

  if (!status) return null;
  return (
    <>
      <ValidatorSearchInput id="delegate-search-bar" search={search} onSearch={onSearch} />
      <ValidatorListHeader
        votesSelected={delegationsSelected}
        votesAvailable={max}
        max={formatMax}
        maxText={formatMaxText}
        maxVotes={COSMOS_MAX_DELEGATIONS}
        totalValidators={SR.length}
        notEnoughVotes={notEnoughDelegations}
      />
      <Box ref={containerRef} id="delegate-list">
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

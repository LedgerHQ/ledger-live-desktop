// @flow
import invariant from "invariant";
import styled from "styled-components";
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
import { mapDelegations } from "@ledgerhq/live-common/lib/families/cosmos/utils";
import type {
  CosmosDelegation,
  CosmosDelegationInfo,
  CosmosMappedValidator,
} from "@ledgerhq/live-common/lib/families/cosmos/types";

import { openURL } from "~/renderer/linking";
import Box from "~/renderer/components/Box";
import ValidatorRow, { IconContainer } from "~/renderer/components/Delegation/ValidatorRow";
import ValidatorListHeader from "~/renderer/components/Delegation/ValidatorListHeader";
import ScrollLoadingList from "~/renderer/components/ScrollLoadingList";
import ValidatorSearchInput, {
  NoResultPlaceholder,
} from "~/renderer/components/Delegation/ValidatorSearchInput";
import InputCurrency from "~/renderer/components/InputCurrency";
import FirstLetterIcon from "~/renderer/components/FirstLetterIcon";
import Text from "~/renderer/components/Text";

const InputRight = styled(Box).attrs(() => ({
  ff: "Inter|Medium",
  color: "palette.text.shade60",
  fontSize: 4,
  justifyContent: "center",
  horizontal: true,
}))`
  opacity: 0;
  pointer-events: none;
  padding: 5px ${p => p.theme.space[2]}px;
  > * {
    color: white !important;
  }
`;

const InputBox = styled(Box).attrs(() => ({
  horizontal: true,
  alignItems: "center",
}))`
  position: relative;
  flex-basis: 160px;
  height: 32px;
  &:focus ${InputRight}, &:focus-within ${InputRight} {
    opacity: 1;
    pointer-events: auto;
  }
  #input-error {
    font-size: 10px;
    padding-bottom: 4px;
  }
`;

const MaxButton = styled.button`
  background-color: ${p => p.theme.colors.palette.primary.main};
  color: ${p => p.theme.colors.palette.primary.contrastText}!important;
  border: none;
  border-radius: 4px;
  padding: 0px ${p => p.theme.space[2]}px;
  margin: 0 2.5px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 200ms ease-out;
  &:hover {
    filter: contrast(2);
  }
`;

export const formatValue = (value: BigNumber, unit: *): number =>
  value.dividedBy(10 ** unit.magnitude).toNumber();

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

  const { validators: cosmosValidators } = useCosmosPreloadData();
  const SR = useSortedValidators(search, cosmosValidators, []);
  const currentDelegations = mapDelegations(delegations, cosmosValidators, unit);

  const delegationsAvailable = account.spendableBalance;
  const delegationsUsed = validators.reduce((sum, v) => sum.plus(v.amount), BigNumber(0));
  const delegationsSelected = validators.length;
  const max = account.spendableBalance.minus(delegationsUsed);

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

  const notEnoughDelegations = delegationsUsed.gt(delegationsAvailable);

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

      const onChange = value => onUpdateDelegation(validator.validatorAddress, value);

      const onMax = () =>
        onUpdateDelegation(validator.validatorAddress, item ? item.amount.plus(max) : max);

      const maxError = item && item.amount && max.lt(0);

      const error = maxError;

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
                <b></b>
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
          notEnoughVotes={notEnoughDelegations}
          maxAvailable={max}
          Input={
            <InputBox active={item && item.amount}>
              <InputCurrency
                containerProps={{ grow: true, style: { height: 32, zIndex: 10 } }}
                unit={unit}
                error={error}
                disabled={!item && max.lte(0)}
                value={item && item.amount}
                onChange={onChange}
                renderRight={
                  <InputRight>
                    {max.gt(0) && (
                      <MaxButton onClick={onMax}>
                        <Trans i18nKey="vote.steps.castVotes.max" />
                      </MaxButton>
                    )}
                  </InputRight>
                }
              />
            </InputBox>
          }
        />
      );
    },
    [
      validators,
      onUpdateDelegation,
      onExternalLink,
      notEnoughDelegations,
      max,
      unit,
      currentDelegations,
    ],
  );

  if (!status) return null;
  return (
    <>
      <ValidatorSearchInput search={search} onSearch={onSearch} />
      <ValidatorListHeader
        votesSelected={delegationsSelected}
        votesAvailable={delegationsAvailable}
        max={formatValue(max, unit)}
        maxVotes={Infinity}
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

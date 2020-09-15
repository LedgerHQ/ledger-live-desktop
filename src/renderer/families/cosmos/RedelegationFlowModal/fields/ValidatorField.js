// @flow
import invariant from "invariant";
import React, { useState, useCallback } from "react";
import styled from "styled-components";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import {
  useCosmosPreloadData,
  useSortedValidators,
  useCosmosMappedDelegations,
} from "@ledgerhq/live-common/lib/families/cosmos/react";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import { getDefaultExplorerView, getAddressExplorer } from "@ledgerhq/live-common/lib/explorers";

import { openURL } from "~/renderer/linking";

import Box from "~/renderer/components/Box";
import ValidatorSearchInput, {
  NoResultPlaceholder,
} from "~/renderer/components/Delegation/ValidatorSearchInput";
import ScrollLoadingList from "~/renderer/components/ScrollLoadingList";
import ValidatorRow, { IconContainer } from "~/renderer/components/Delegation/ValidatorRow";
import { Trans } from "react-i18next";
import FirstLetterIcon from "~/renderer/components/FirstLetterIcon";
import Text from "~/renderer/components/Text";

const ValidatorsSection: ThemedComponent<{}> = styled(Box)`
  width: 100%;
  height: 100%;
  padding-bottom: ${p => p.theme.space[6]}px;
`;

export default function ValidatorField({ account, transaction, t, onChange }: *) {
  const { validators } = useCosmosPreloadData();
  const { cosmosResources } = account;

  invariant(cosmosResources, "cosmosResources required");

  const unit = getAccountUnit(account);

  const formattedDelegations = cosmosResources.delegations.map(({ validatorAddress, ...d }) => ({
    ...d,
    address: validatorAddress,
  }));

  const [search, setSearch] = useState("");
  const onSearch = useCallback(evt => setSearch(evt.target.value), [setSearch]);

  const sortedValidators = useSortedValidators(search, validators, formattedDelegations);
  const fromValidatorAddress = transaction.cosmosSourceValidator;
  const sortedFilteredValidators = sortedValidators.filter(
    v => v.validator.validatorAddress !== fromValidatorAddress,
  );

  const mappedDelegations = useCosmosMappedDelegations(account);

  const explorerView = getDefaultExplorerView(account.currency);

  const onExternalLink = useCallback(
    (address: string) => {
      const srURL = explorerView && getAddressExplorer(explorerView, address);
      if (srURL) openURL(srURL);
    },
    [explorerView],
  );

  const onSelect = useCallback(
    validator => {
      onChange(validator);
    },
    [onChange],
  );

  const renderItem = useCallback(
    ({ validator, rank, address }, i) => {
      const d = mappedDelegations.find(d => d.validatorAddress === validator.validatorAddress);
      return (
        <ValidatorRow
          key={`SR_${validator.address}_${i}`}
          validator={{ ...validator, address: address || validator.validatorAddress }}
          icon={
            <IconContainer isSR>
              <FirstLetterIcon label={validator.name || validator.validatorAddress} />
            </IconContainer>
          }
          title={`${rank}. ${validator.name || validator.address}`}
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
                {validator.estimatedYearlyRewardsRate
                  ? (validator.estimatedYearlyRewardsRate * 1e2).toFixed(2)
                  : "N/A"}
              </Text>
              <Text textAlign="center" fontSize={1}>
                <Trans i18nKey="cosmos.delegation.estYield" />
              </Text>
            </Box>
          }
          onExternalLink={onExternalLink}
          onClick={onSelect}
          style={{ cursor: "pointer" }}
          unit={unit}
        />
      );
    },
    [onExternalLink, onSelect, mappedDelegations, unit],
  );

  return (
    <ValidatorsSection>
      <ValidatorSearchInput search={search} onSearch={onSearch} />
      <Box horizontal alignItems="center" justifyContent="space-between" py={2} px={3}>
        <Text fontSize={3} ff="Inter|Medium">
          <Trans
            i18nKey="vote.steps.castVotes.validators"
            values={{ total: sortedValidators.length }}
          />
        </Text>
      </Box>
      <ScrollLoadingList
        data={sortedFilteredValidators}
        style={{ flex: "1 0 350px" }}
        renderItem={renderItem}
        noResultPlaceholder={
          validators.length <= 0 && search && <NoResultPlaceholder search={search} />
        }
      />
    </ValidatorsSection>
  );
}

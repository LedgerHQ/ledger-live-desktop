// @flow
import invariant from "invariant";
import React, { useCallback, useState, useRef, useEffect } from "react";
import type { TFunction } from "react-i18next";
import styled from "styled-components";
import { Trans } from "react-i18next";

import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import { getDefaultExplorerView, getAddressExplorer } from "@ledgerhq/live-common/lib/explorers";
import type { Account, TransactionStatus } from "@ledgerhq/live-common/lib/types";
import { MAX_NOMINATIONS } from "@ledgerhq/live-common/lib/families/polkadot/logic";
import {
  usePolkadotPreloadData,
  useSortedValidators,
} from "@ledgerhq/live-common/lib/families/polkadot/react";

import type {
  PolkadotNominationInfo,
  PolkadotNomination,
  PolkadotValidator,
} from "@ledgerhq/live-common/lib/families/polkadot/types";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { radii } from "~/renderer/styles/theme";
import { openURL } from "~/renderer/linking";
import Box from "~/renderer/components/Box";
import ValidatorListHeader from "~/renderer/components/Delegation/ValidatorListHeader";
import ScrollLoadingList from "~/renderer/components/ScrollLoadingList";
import ValidatorSearchInput, {
  NoResultPlaceholder,
} from "~/renderer/components/Delegation/ValidatorSearchInput";

// Specific Validator Row
import ValidatorRow from "./ValidatorRow";

const NominationsWarning: ThemedComponent<{}> = styled(Box).attrs(p => ({
  horizontal: true,
  alignItems: "center",
  py: "8px",
  px: 3,
  bg: p.theme.colors.warning,
  color: "palette.primary.contrastText",
  mb: 20,
  fontSize: 4,
  ff: "Inter|SemiBold",
}))`
  border-radius: ${radii[1]}px;
`;

type Props = {
  t: TFunction,
  validators: PolkadotNominationInfo[],
  nominations: PolkadotNomination[],
  account: Account,
  status: TransactionStatus,
  onChangeNominations: (updater: (PolkadotNominationInfo[]) => PolkadotNominationInfo[]) => void,
  bridgePending: boolean,
};

const ValidatorField = ({
  t,
  account,
  onChangeNominations,
  status,
  bridgePending,
  validators,
  nominations,
}: Props) => {
  invariant(account, "polkadot account required");

  const [search, setSearch] = useState("");
  const { polkadotResources } = account;
  invariant(polkadotResources && nominations, "polkadot transaction required");

  const unit = getAccountUnit(account);

  const { staking, validators: polkadotValidators } = usePolkadotPreloadData();
  const SR = useSortedValidators(search, polkadotValidators, nominations);
  const { maxNominatorRewardedPerValidator } = staking;

  // Addresses that are no longer validators
  const nonValidators = nominations
    .filter(nomination => !nomination.status)
    .map(nomination => nomination.address);

  const validatorsSelected = validators.length;

  const onUpdateNomination = useCallback(
    (address, isSelected) => {
      onChangeNominations(existing => {
        const update = existing.filter(v => v !== address);
        if (isSelected) {
          update.push(address);
        }
        return update;
      });
    },
    [onChangeNominations],
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

  /** auto focus first input on mount */
  useEffect(() => {
    if (containerRef && containerRef.current && containerRef.current.querySelector) {
      const firstInput = containerRef.current.querySelector("input");
      if (firstInput && firstInput.focus) firstInput.focus();
    }
  }, []);

  const renderItem = useCallback(
    (validator: PolkadotValidator, i) => {
      const isSelected = validators.indexOf(validator.address) > -1;

      const disabled = validators.length >= MAX_NOMINATIONS;

      return (
        <ValidatorRow
          key={`SR_${validator.address}_${i}`}
          validator={validator}
          unit={unit}
          isSelected={isSelected}
          onExternalLink={onExternalLink}
          onUpdateVote={onUpdateNomination}
          disabled={disabled}
          maxNominatorRewardedPerValidator={maxNominatorRewardedPerValidator}
        />
      );
    },
    [validators, unit, onExternalLink, onUpdateNomination, maxNominatorRewardedPerValidator],
  );

  if (!status) return null;
  return (
    <>
      {nonValidators.length ? (
        <NominationsWarning>
          <Trans
            i18nKey="polkadot.nominate.steps.validators.notValidatorsRemoved"
            values={{ count: nonValidators.length }}
          />
        </NominationsWarning>
      ) : null}
      <ValidatorSearchInput id="nominate-search-bar" search={search} onSearch={onSearch} />
      <ValidatorListHeader
        votesSelected={validatorsSelected}
        votesAvailable={MAX_NOMINATIONS}
        max={0}
        maxText={""}
        maxVotes={MAX_NOMINATIONS}
        totalValidators={SR.length}
        notEnoughVotes={false}
      />
      <Box ref={containerRef} id="nominate-list">
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

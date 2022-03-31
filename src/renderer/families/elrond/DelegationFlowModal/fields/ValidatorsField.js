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

const ValidatorField = ({
  t,
  account,
  onChangeDelegations,
  status,
  bridgePending,
  delegations,
  validators,
  providers,
}: Props) => {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState(
    providers.map(provider => ({
      ...provider,
      searched: true,
    })),
  );

  const onSearch = event => {
    setSearch(event.target.value);
    setItems(items =>
      items.map(validator => ({
        ...validator,
        searched:
          event.target.value === ""
            ? true
            : validator.identity.name
            ? validator.identity.name.toLowerCase().indexOf(event.target.value.toLowerCase()) > -1
            : false,
      })),
    );
  };

  const visibleItems = items.filter(validator => validator.searched);
  const unit = getAccountUnit(account);

  const formattedDelegations = delegations.map(({ validatorAddress, ...d }) => ({
    ...d,
    address: validatorAddress,
  }));

  const { validators: cosmosValidators } = useCosmosPreloadData();
  const currentDelegations = mapDelegations(delegations, cosmosValidators, unit);

  const delegationsUsed = validators.reduce((sum, v) => sum.plus(v.amount), BigNumber(0));
  const delegationsSelected = validators.length;

  const max = getMaxDelegationAvailable(account, delegationsSelected).minus(delegationsUsed);

  const onUpdateDelegation = useCallback(
    (recipient, value) =>
      onChangeDelegations({
        recipient,
        amount: BigNumber(value),
        mode: "delegate",
      }),
    [onChangeDelegations],
  );

  const containerRef = useRef();

  const explorerView = getDefaultExplorerView(account.currency);

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
    (validator, index) => {
      const [provider] = validator.providers;

      const item = validators.find(v => v.address === validator.validatorAddress);
      const d = currentDelegations.find(v => v.validatorAddress === validator.validatorAddress);

      // const currentMax = item
      //   ? max
      //   : getMaxDelegationAvailable(account, delegationsSelected + 1).minus(delegationsUsed);

      // const onMax = () =>
      //   onUpdateDelegation(validator.validatorAddress, item ? item.amount.plus(max) : currentMax);

      // const disabled = !item && (currentMax.lte(0) || delegationsSelected >= COSMOS_MAX_DELEGATIONS);

      return (
        <ValidatorRow
          key={`SR_${validator.contract}_${index}`}
          validator={{ address: provider }}
          icon={
            <IconContainer isSR={true}>
              <FirstLetterIcon label={validator.name || provider} />
            </IconContainer>
          }
          title={`${index + 1}. ${validator.name || provider}`}
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
                {validator.apr ? `${validator.apr} %` : "N/A"}
              </Text>
              <Text textAlign="center" fontSize={1}>
                <Trans i18nKey="cosmos.delegation.estYield" />
              </Text>
            </Box>
          }
          value={item && item.amount.toNumber()}
          onExternalLink={() =>
            openURL(`https://testnet-explorer.elrond.com/providers/${provider}
          `)
          }
          notEnoughVotes={item && item.amount && max.lt(0)}
          // maxAvailable={max.toNumber()}
          unit={unit}
          onUpdateVote={onUpdateDelegation}
          // onMax={onMax}
          // shouldRenderMax={currentMax.gt(0)}
          // disabled={disabled}
        />
      );
    },
    [
      validators,
      onUpdateDelegation,
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
      {/* <ValidatorListHeader
        votesSelected={delegationsSelected}
        votesAvailable={max.toNumber()}
        max={formatMax}
        maxText={formatMaxText}
        maxVotes={COSMOS_MAX_DELEGATIONS}
        totalValidators={SR.length}
        notEnoughVotes={notEnoughDelegations}
      /> */}
      <Box id="delegate-list">
        <ScrollLoadingList
          data={visibleItems}
          style={{ flex: "1 0 240px" }}
          renderItem={renderItem}
          noResultPlaceholder={
            visibleItems.length <= 0 && search && <NoResultPlaceholder search={search} />
          }
        />
      </Box>
    </>
  );
};

export default ValidatorField;

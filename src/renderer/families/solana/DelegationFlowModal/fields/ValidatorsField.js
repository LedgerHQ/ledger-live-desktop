// @flow
import invariant from "invariant";
import React, { useCallback, useState, useRef, useEffect, useMemo } from "react";
import { Trans } from "react-i18next";
import { BigNumber } from "bignumber.js";
import type { TFunction } from "react-i18next";

import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import { getDefaultExplorerView, getAddressExplorer } from "@ledgerhq/live-common/lib/explorers";
import type { Account, TransactionStatus } from "@ledgerhq/live-common/lib/types";
import {
  useSolanaPreloadData,
  //useSortedValidators,
} from "@ledgerhq/live-common/lib/families/solana/react";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";
import type { SolanaValidatorWithMeta } from "@ledgerhq/live-common/lib/families/solana/types";

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
  account: Account,
  status: TransactionStatus,
  //onChangeDelegations: (updater: (CosmosDelegationInfo[]) => CosmosDelegationInfo[]) => void,
  bridgePending: boolean,
};

const ValidatorField = ({
  t,
  account,
  //onChangeDelegations,
  status,
  bridgePending,
}: Props) => {
  if (!status) return null;

  invariant(account && account.solanaResources, "solana account and resources required");

  const { solanaResources } = account;

  const [search, setSearch] = useState("");

  const unit = getAccountUnit(account);

  const { validatorsWithMeta } = useSolanaPreloadData(account.currency);

  const validatorsWithMetaSearched = validatorsWithMeta.filter(({ meta, validator }) => {
    return meta.name?.startsWith(search) || validator.voteAccAddr.startsWith(search);
  });

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
    /** $FlowFixMe */
    if (containerRef && containerRef.current && containerRef.current.querySelector) {
      const firstInput = containerRef.current.querySelector("input");
      if (firstInput && firstInput.focus) firstInput.focus();
    }
  }, []);

  const renderItem = (validatorWithMeta: SolanaValidatorWithMeta, i: number) => {
    const { validator, meta } = validatorWithMeta;
    return (
      <ValidatorRow
        key={validator.voteAccAddr}
        validator={{ address: validator.voteAccAddr }}
        icon={
          <IconContainer isSR>
            <FirstLetterIcon label={validator.voteAccAddr} />
          </IconContainer>
        }
        title={meta.name ?? validator.voteAccAddr}
        subtitle={
          <>
            <Trans i18nKey="solana.delegation.totalStake"></Trans>
            <Text style={{ marginLeft: 5 }}>
              {formatCurrencyUnit(unit, new BigNumber(validator.activatedStake), {
                showCode: true,
              })}
            </Text>
          </>
        }
        onExternalLink={onExternalLink}
        unit={unit}
        sideInfo={
          <Box pr={1}>
            <Text textAlign="center" ff="Inter|SemiBold" fontSize={2}>
              {`${validator.commission} %`}
            </Text>
            <Text textAlign="center" fontSize={1}>
              <Trans i18nKey="solana.delegation.commission" />
            </Text>
          </Box>
        }
      ></ValidatorRow>
    );
  };

  return (
    <>
      <ValidatorSearchInput id="delegate-search-bar" search={search} onSearch={onSearch} />
      <Box ref={containerRef} id="delegate-list">
        <ScrollLoadingList
          data={validatorsWithMetaSearched}
          style={{ flex: "1 0 240px" }}
          renderItem={renderItem}
          noResultPlaceholder={
            validatorsWithMetaSearched.length <= 0 &&
            search.length > 0 && <NoResultPlaceholder search={search} />
          }
        />
      </Box>
    </>
  );
};

export default ValidatorField;

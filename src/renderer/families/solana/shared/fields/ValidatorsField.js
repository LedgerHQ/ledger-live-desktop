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
import type { ValidatorAppValidator } from "@ledgerhq/live-common/lib/families/solana/validator-app";

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
import Image from "~/renderer/components/Image";

type Props = {
  t: TFunction,
  account: Account,
  status: TransactionStatus,
  chosenVoteAccAddr: ?string,
  onChangeValidator: (v: ValidatorAppValidator) => void,
};

const ValidatorField = ({ t, account, onChangeValidator, chosenVoteAccAddr, status }: Props) => {
  if (!status) return null;

  invariant(account && account.solanaResources, "solana account and resources required");

  const { solanaResources } = account;

  const [search, setSearch] = useState("");

  const unit = getAccountUnit(account);

  const solanaPreloadData = useSolanaPreloadData(account.currency);

  const validatorsFiltered = useMemo(() => {
    return (solanaPreloadData?.validators || []).filter(validator => {
      return (
        validator.name?.toLowerCase().startsWith(search) ||
        validator.voteAccount.toLowerCase().startsWith(search)
      );
    });
  }, [solanaPreloadData, search]);

  const containerRef = useRef();

  const explorerView = getDefaultExplorerView(account.currency);

  const onExternalLink = useCallback(
    (address: string) => {
      const validator = (solanaPreloadData?.validators ?? []).find(v => v.voteAccount === address);
      if (validator && validator.wwwUrl) {
        openURL(validator.wwwUrl);
      }
    },
    [explorerView],
  );

  const onSearch = (event: SyntheticInputEvent<HTMLInputElement>) => setSearch(event.target.value);

  /** auto focus first input on mount */
  useEffect(() => {
    /** $FlowFixMe */
    if (containerRef && containerRef.current && containerRef.current.querySelector) {
      const firstInput = containerRef.current.querySelector("input");
      if (firstInput && firstInput.focus) firstInput.focus();
    }
  }, []);

  const renderItem = (validator: ValidatorAppValidator) => {
    //const { validator, meta } = validator;
    return (
      <ValidatorRow
        // HACK: if value > 0 then row is shown as active
        value={chosenVoteAccAddr === validator.voteAccount ? 1 : 0}
        onClick={onChangeValidator}
        key={validator.voteAccount}
        validator={{ address: validator.voteAccount }}
        icon={
          <IconContainer isSR>
            {validator.avatarUrl === undefined && <FirstLetterIcon label={validator.voteAccount} />}
            {validator.avatarUrl !== undefined && (
              <Image resource={validator.avatarUrl} alt="" width={32} height={32} />
            )}
          </IconContainer>
        }
        title={validator.name ?? validator.voteAccount}
        subtitle={
          <>
            <Trans i18nKey="solana.delegation.totalStake"></Trans>
            <Text style={{ marginLeft: 5 }}>
              {formatCurrencyUnit(unit, new BigNumber(validator.activeStake), {
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
          data={validatorsFiltered}
          style={{ flex: "1 0 240px" }}
          renderItem={renderItem}
          noResultPlaceholder={
            validatorsFiltered.length <= 0 &&
            search.length > 0 && <NoResultPlaceholder search={search} />
          }
        />
      </Box>
    </>
  );
};

export default ValidatorField;

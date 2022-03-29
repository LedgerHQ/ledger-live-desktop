// @flow
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import { getAddressExplorer, getDefaultExplorerView } from "@ledgerhq/live-common/lib/explorers";
import { useLedgerFirstShuffledValidators } from "@ledgerhq/live-common/lib/families/solana/react";
import { swap } from "@ledgerhq/live-common/lib/families/solana/utils";
import type { ValidatorAppValidator } from "@ledgerhq/live-common/lib/families/solana/validator-app";
import type { Account, TransactionStatus } from "@ledgerhq/live-common/lib/types";
import invariant from "invariant";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { TFunction } from "react-i18next";
import { Trans } from "react-i18next";
import styled from "styled-components";
import Box from "~/renderer/components/Box";
import { NoResultPlaceholder } from "~/renderer/components/Delegation/ValidatorSearchInput";
import ScrollLoadingList from "~/renderer/components/ScrollLoadingList";
import Text from "~/renderer/components/Text";
import IconAngleDown from "~/renderer/icons/AngleDown";
import { openURL } from "~/renderer/linking";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import ValidatorRow from "./ValidatorRow";

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
  const [showAll, setShowAll] = useState(false);

  const unit = getAccountUnit(account);

  const validators = useLedgerFirstShuffledValidators(account.currency);

  const preparedValidators = useMemo(() => {
    // validators[0] is Ledger's one, but if there is a chosen validator,
    // we need to move it to the first position
    if (chosenVoteAccAddr !== null) {
      const chosenValidatorIdx = validators.findIndex(v => v.voteAccount === chosenVoteAccAddr);
      if (chosenValidatorIdx !== -1) {
        const swapedValidators = [...validators];
        swap(swapedValidators, chosenValidatorIdx, 1);
        swap(swapedValidators, 0, 1);
        return swapedValidators;
      }
    }

    return validators;
  }, [validators, chosenVoteAccAddr]);

  const validatorsFiltered = useMemo(() => {
    return validators.filter(validator => {
      return (
        validator.name?.toLowerCase().includes(search) ||
        validator.voteAccount.toLowerCase().includes(search)
      );
    });
  }, [validators, search]);

  const containerRef = useRef();

  const onSearch = (event: SyntheticInputEvent<HTMLInputElement>) => setSearch(event.target.value);

  /** auto focus first input on mount */
  useEffect(() => {
    /** $FlowFixMe */
    if (containerRef && containerRef.current && containerRef.current.querySelector) {
      const firstInput = containerRef.current.querySelector("input");
      if (firstInput && firstInput.focus) firstInput.focus();
    }
  }, []);

  const renderItem = (validator: ValidatorAppValidator, validatorIdx: number) => {
    return (
      <ValidatorRow
        currency={account.currency}
        active={chosenVoteAccAddr === validator.voteAccount}
        showStake={validatorIdx !== 0}
        onClick={onChangeValidator}
        key={validator.voteAccount}
        validator={validator}
        unit={unit}
      ></ValidatorRow>
    );
  };

  return (
    <>
      <Box>
        <ScrollLoadingList
          data={showAll ? preparedValidators : [preparedValidators[0]]}
          style={{ flex: showAll ? "1 0 240px" : "1 0 66px", marginBottom: 0 }}
          renderItem={renderItem}
          noResultPlaceholder={
            validatorsFiltered.length <= 0 &&
            search.length > 0 && <NoResultPlaceholder search={search} />
          }
        />
      </Box>
      <SeeAllButton expanded={showAll} onClick={() => setShowAll(shown => !shown)}>
        <Text color="wallet" ff="Inter|SemiBold" fontSize={4}>
          <Trans i18nKey={showAll ? "distribution.showLess" : "distribution.showAll"} />
        </Text>
        <IconAngleDown size={16} />
      </SeeAllButton>
    </>
  );
};

const SeeAllButton: ThemedComponent<{ expanded: boolean }> = styled.div`
  margin-top: 15px;
  display: flex;
  color: ${p => p.theme.colors.wallet};
  align-items: center;
  justify-content: center;
  border-top: 1px solid ${p => p.theme.colors.palette.divider};
  height: 40px;
  cursor: pointer;

  &:hover ${Text} {
    text-decoration: underline;
  }

  > :nth-child(2) {
    margin-left: 8px;
    transform: rotate(${p => (p.expanded ? "180deg" : "0deg")});
  }
`;

export default ValidatorField;

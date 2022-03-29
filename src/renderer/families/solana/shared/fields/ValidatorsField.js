// @flow
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";
import { getAddressExplorer, getDefaultExplorerView } from "@ledgerhq/live-common/lib/explorers";
import { useLedgerFirstShuffledValidators } from "@ledgerhq/live-common/lib/families/solana/react";
import type { ValidatorAppValidator } from "@ledgerhq/live-common/lib/families/solana/validator-app";
import type { Account, TransactionStatus } from "@ledgerhq/live-common/lib/types";
import { BigNumber } from "bignumber.js";
import invariant from "invariant";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { TFunction } from "react-i18next";
import { Trans } from "react-i18next";
import Box from "~/renderer/components/Box";
import ValidatorRow, { IconContainer } from "~/renderer/components/Delegation/ValidatorRow";
import ValidatorSearchInput, {
  NoResultPlaceholder,
} from "~/renderer/components/Delegation/ValidatorSearchInput";
import FirstLetterIcon from "~/renderer/components/FirstLetterIcon";
import Image from "~/renderer/components/Image";
import ScrollLoadingList from "~/renderer/components/ScrollLoadingList";
import Text from "~/renderer/components/Text";
import { openURL } from "~/renderer/linking";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import IconAngleDown from "~/renderer/icons/AngleDown";
import styled from "styled-components";
import CollapsibleCard from "~/renderer/components/CollapsibleCard";
import ListTreeLine from "~/renderer/icons/ListTreeLine";
import CollapsibleList from "~/renderer/families/polkadot/components/CollapsibleList";
import Check from "~/renderer/icons/Check";

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

  const validatorsFiltered = useMemo(() => {
    return validators.filter(validator => {
      return (
        validator.name?.toLowerCase().includes(search) ||
        validator.voteAccount.toLowerCase().includes(search)
      );
    });
  }, [validators, search]);

  const containerRef = useRef();

  const explorerView = getDefaultExplorerView(account.currency);

  const onExternalLink = useCallback(
    (address: string) => {
      const validator = validators.find(v => v.voteAccount === address);

      const url =
        (validator && validator.wwwUrl) ||
        (explorerView && getAddressExplorer(explorerView, address));

      if (url) {
        openURL(url);
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

  const renderItem = (validator: ValidatorAppValidator, validatorIdx: number) => {
    return (
      <SolanaValidatorRow
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
        title={validator.name || validator.voteAccount}
        onExternalLink={onExternalLink}
        unit={unit}
        subtitle={
          validatorIdx !== 0 ? (
            <>
              <Trans i18nKey="solana.delegation.totalStake"></Trans>
              <Text style={{ marginLeft: 5 }}>
                {formatCurrencyUnit(unit, new BigNumber(validator.activeStake), {
                  showCode: true,
                })}
              </Text>
            </>
          ) : null
        }
        sideInfo={
          <Box ml={5} style={{ flexDirection: "row", alignItems: "center" }}>
            <Box>
              <Text textAlign="center" ff="Inter|SemiBold" fontSize={2}>
                {`${validator.commission} %`}
              </Text>
              <Text textAlign="center" fontSize={1}>
                <Trans i18nKey="solana.delegation.commission" />
              </Text>
            </Box>
            <Box ml={3}>
              <ChosenMark active={chosenVoteAccAddr === validator.voteAccount} />
            </Box>
          </Box>
        }
      ></SolanaValidatorRow>
    );
  };

  return (
    <>
      <Box>
        <ScrollLoadingList
          data={showAll ? validatorsFiltered : [validatorsFiltered[0]]}
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

const SolanaValidatorRow = styled(ValidatorRow)`
  border-color: transparent;
`;

const ChosenMark: ThemedComponent<{ active: boolean }> = styled(Check).attrs(p => ({
  color: p.active ? p.theme.colors.palette.primary.main : "transparent",
  size: 14,
}))``;

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

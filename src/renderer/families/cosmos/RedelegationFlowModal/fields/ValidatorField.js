// @flow
import React, { useState, useCallback, useMemo } from "react";
import styled from "styled-components";

import { useCosmosPreloadData } from "@ledgerhq/live-common/lib/families/cosmos/react";
import { getDefaultExplorerView, getAddressExplorer } from "@ledgerhq/live-common/lib/explorers";

import { openURL } from "~/renderer/linking";

import Box from "~/renderer/components/Box";
import { Base as Button } from "~/renderer/components/Button";
import Label from "~/renderer/components/Label";
import ChevronRight from "~/renderer/icons/ChevronRight";
import ValidatorSearchInput, {
  NoResultPlaceholder,
} from "~/renderer/components/Delegation/ValidatorSearchInput";
import ScrollLoadingList from "~/renderer/components/ScrollLoadingList";
import ValidatorRow, { IconContainer } from "~/renderer/components/Delegation/ValidatorRow";
import { Trans } from "react-i18next";
import { useSortedValidators } from "../../DelegationFlowModal/fields/ValidatorsField";
import FirstLetterIcon from "~/renderer/components/FirstLetterIcon";
import Text from "~/renderer/components/Text";

const SelectButton = styled(Button)`
  border-radius: 4px;
  border: 1px solid ${p => p.theme.colors.palette.divider};
  height: 48px;
  width: 100%;
  padding-right: ${p => p.theme.space[3]}px;
  padding-left: ${p => p.theme.space[3]}px;
  &:hover {
    background-color: transparent;
    border-color: ${p => p.theme.colors.palette.text.shade30};
  }
`;

const ValidatorsSection = styled(Box)`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: ${p => p.theme.colors.palette.background.paper};
  opacity: ${p => (p.isOpen ? 1 : 0)};
  pointer-events: ${p => (p.isOpen ? "auto" : "none")};
  z-index: 10;
  margin-top: 0px;
  padding-bottom: ${p => p.theme.space[6]}px;
`;

export default function ValidatorField({
  account,
  transaction,
  t,
  onChange,
  onOpenChange,
  isOpen,
}: *) {
  const { validators } = useCosmosPreloadData();

  const [search, setSearch] = useState("");

  const open = useCallback(() => {
    onOpenChange(true);
  }, [onOpenChange]);
  const close = useCallback(() => onOpenChange(false), [onOpenChange]);
  const onSearch = useCallback(evt => setSearch(evt.target.value), [setSearch]);

  const sortedValidators = useSortedValidators(search, validators, []);

  const selectedValidator = useMemo(
    () =>
      transaction.validators && transaction.validators[0]
        ? validators.find(
            ({ validatorAddress }) => validatorAddress === transaction.validators[0].address,
          )
        : null,
    [transaction, validators],
  );

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
      close();
    },
    [close, onChange],
  );

  const renderItem = useCallback(
    ({ validator, rank, address }, i) => {
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
          onExternalLink={onExternalLink}
          onClick={onSelect}
          style={{ cursor: "pointer" }}
        />
      );
    },
    [onExternalLink, onSelect],
  );

  return (
    <Box flow={1} pb={1}>
      <Label>{t("cosmos.redelegation.flow.steps.validators.newDelegation")}</Label>
      <SelectButton onClick={open}>
        <Box flex="1" horizontal alignItems="center" justifyContent="space-between">
          {selectedValidator ? (
            <Box horizontal alignItems="center">
              <FirstLetterIcon
                label={selectedValidator.name || selectedValidator.validatorAddress}
                mr={2}
              />
              <Text ff="Inter|Medium">
                {selectedValidator.name || selectedValidator.validatorAddress}
              </Text>
            </Box>
          ) : (
            t("cosmos.redelegation.flow.steps.validators.chooseValidator")
          )}
          <ChevronRight size={16} />
        </Box>
      </SelectButton>
      <ValidatorsSection isOpen={isOpen}>
        <ValidatorSearchInput search={search} onSearch={onSearch} />
        <Box horizontal alignItems="center" justifyContent="space-between" py={2} px={3}>
          <Text fontSize={3} ff="Inter|Medium">
            <Trans
              i18nKey="vote.steps.castVotes.validators"
              values={{ total: sortedValidators.length }}
            />
          </Text>
        </Box>
        {isOpen && (
          <ScrollLoadingList
            data={sortedValidators}
            style={{ flex: "1 0 240px" }}
            renderItem={renderItem}
            noResultPlaceholder={
              validators.length <= 0 && search && <NoResultPlaceholder search={search} />
            }
          />
        )}
      </ValidatorsSection>
    </Box>
  );
}

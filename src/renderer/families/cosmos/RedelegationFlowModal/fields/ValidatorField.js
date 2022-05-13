// @flow
import invariant from "invariant";
import React from "react";
import styled from "styled-components";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import { useLedgerFirstShuffledValidatorsCosmos } from "@ledgerhq/live-common/lib/families/cosmos/react";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";

import Box from "~/renderer/components/Box";
import { NoResultPlaceholder } from "~/renderer/components/Delegation/ValidatorSearchInput";
import ScrollLoadingList from "~/renderer/components/ScrollLoadingList";
import { Trans } from "react-i18next";
import Text from "~/renderer/components/Text";
import ValidatorRow from "~/renderer/families/cosmos/shared/components/ValidatorRow";

const ValidatorsSection: ThemedComponent<{}> = styled(Box)`
  width: 100%;
  height: 100%;
  padding-bottom: ${p => p.theme.space[6]}px;
`;

export default function ValidatorField({ account, transaction, t, onChange }: *) {
  const validators = useLedgerFirstShuffledValidatorsCosmos();
  const { cosmosResources } = account;

  invariant(cosmosResources, "cosmosResources required");

  const unit = getAccountUnit(account);

  const fromValidatorAddress = transaction.cosmosSourceValidator;
  const sortedFilteredValidators = validators.filter(
    v => v.validatorAddress !== fromValidatorAddress,
  );

  const renderItem = validator => {
    return (
      <ValidatorRow
        currency={account.currency}
        key={validator.validatorAddress}
        validator={validator}
        unit={unit}
        onClick={onChange}
      />
    );
  };

  return (
    <ValidatorsSection>
      <Box horizontal alignItems="center" justifyContent="space-between" py={2} px={3}>
        <Text fontSize={3} ff="Inter|Medium">
          <Trans
            i18nKey="vote.steps.castVotes.validators"
            values={{ total: sortedFilteredValidators.length }}
          />
        </Text>
      </Box>
      <ScrollLoadingList
        data={sortedFilteredValidators}
        style={{ flex: "1 0 350px" }}
        renderItem={renderItem}
        noResultPlaceholder={validators.length <= 0 && <NoResultPlaceholder search={""} />}
      />
    </ValidatorsSection>
  );
}

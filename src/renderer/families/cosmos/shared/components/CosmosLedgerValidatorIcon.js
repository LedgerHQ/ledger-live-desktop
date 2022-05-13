// @flow
import type { CosmosValidatorItem } from "@ledgerhq/live-common/lib/families/cosmos/types";

import React from "react";
import { LEDGER_VALIDATOR_ADDRESS } from "@ledgerhq/live-common/lib/families/cosmos/utils";
import { IconContainer } from "~/renderer/components/Delegation/ValidatorRow";
import LedgerLiveLogo from "~/renderer/components/LedgerLiveLogo";
import Logo from "~/renderer/icons/Logo";
import FirstLetterIcon from "~/renderer/components/FirstLetterIcon";

const CosmosLedgerValidatorIcon = ({ validator }: { validator: CosmosValidatorItem }) => {
  return (
    <IconContainer isSR>
      {validator && validator.validatorAddress === LEDGER_VALIDATOR_ADDRESS ? (
        <LedgerLiveLogo width={24} height={24} icon={<Logo size={15} />} />
      ) : (
        <FirstLetterIcon label={validator.name || validator.validatorAddress} />
      )}
    </IconContainer>
  );
};

export default CosmosLedgerValidatorIcon;

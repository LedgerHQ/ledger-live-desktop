/* eslint-disable consistent-return */
// @flow
import { BigNumber } from "bignumber.js";
import React, { useMemo } from "react";
import { Trans } from "react-i18next";
import { getAccountCurrency, getAccountUnit } from "@ledgerhq/live-common/lib/account";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";
import { getDefaultExplorerView, getAddressExplorer } from "@ledgerhq/live-common/lib/explorers";
import { useCosmosPreloadData } from "@ledgerhq/live-common/lib/families/cosmos/react";
import type {
  CosmosDelegationInfo,
  CosmosValidatorItem,
} from "@ledgerhq/live-common/lib/families/cosmos/types";
import { mapDelegationInfo } from "@ledgerhq/live-common/lib/families/cosmos/utils";
import type { Currency, Unit, Operation, Account } from "@ledgerhq/live-common/lib/types";

import { openURL } from "~/renderer/linking";
import {
  OpDetailsTitle,
  Address,
  OpDetailsData,
  OpDetailsVoteData,
  B,
} from "~/renderer/modals/OperationDetails/styledComponents";
import Box from "~/renderer/components/Box/Box";
import Text from "~/renderer/components/Text";
import { useDiscreetMode } from "~/renderer/components/Discreet";

/** @TODO cosmos update this url */
const helpURL = "https://support.ledger.com/hc/en-us/articles/360013062139";

function getURLFeesInfo(op: Operation): ?string {
  if (op.fee.gt(200000)) {
    return helpURL;
  }
}

function getURLWhatIsThis(op: Operation): ?string {
  if (op.type !== "IN" && op.type !== "OUT") {
    return helpURL;
  }
}

const redirectAddress = (currency: Currency, address: string) => () => {
  /** $FlowFixMe */
  const url = getAddressExplorer(getDefaultExplorerView(currency), address);
  if (url) openURL(url);
};

type OperationDetailsDelegationProps = {
  discreet: boolean,
  unit: Unit,
  currency: Currency,
  delegations: Array<CosmosDelegationInfo>,
  account: Account,
  isTransactionField?: boolean,
  cosmosValidators: CosmosValidatorItem[],
};

export const OperationDetailsDelegation = ({
  discreet,
  unit,
  currency,
  delegations,
  account,
  isTransactionField,
  cosmosValidators,
}: OperationDetailsDelegationProps) => {
  const mappedDelegationInfo = useMemo(
    () => mapDelegationInfo(delegations, cosmosValidators, unit),
    [delegations, cosmosValidators, unit],
  );

  return (
    <Box>
      {!isTransactionField && (
        <OpDetailsTitle>
          <Trans i18nKey={"operationDetails.extra.validators"} />
        </OpDetailsTitle>
      )}

      {mappedDelegationInfo.map(({ formattedAmount, validator, address }, i) => (
        <OpDetailsData key={address + i}>
          <OpDetailsVoteData>
            <Box>
              <Text>
                <Trans
                  i18nKey="operationDetails.extra.votesAddress"
                  values={{
                    votes: formattedAmount,
                    name: validator?.name ?? address,
                  }}
                >
                  <Text ff="Inter|SemiBold">{""}</Text>
                  {""}
                  <Text ff="Inter|SemiBold">{""}</Text>
                </Trans>
              </Text>
            </Box>
            <Address onClick={redirectAddress(currency, address)}>{address}</Address>
          </OpDetailsVoteData>
        </OpDetailsData>
      ))}
    </Box>
  );
};

type OperationDetailsExtraProps = {
  extra: { [key: string]: any },
  type: string,
  account: Account,
};

const OperationDetailsExtra = ({ extra, type, account }: OperationDetailsExtraProps) => {
  const unit = getAccountUnit(account);
  const currency = getAccountCurrency(account);
  const discreet = useDiscreetMode();
  const { validators: cosmosValidators } = useCosmosPreloadData();

  switch (type) {
    case "DELEGATE": {
      const { validators: delegations } = extra;
      if (!delegations || !delegations.length) return null;

      return (
        <OperationDetailsDelegation
          discreet={discreet}
          unit={unit}
          currency={currency}
          delegations={delegations}
          account={account}
          cosmosValidators={cosmosValidators}
        />
      );
    }
    case "UNDELEGATE": {
      const { validator } = extra;
      if (!validator) return null;

      const formattedValidator = cosmosValidators.find(
        v => v.validatorAddress === validator.address,
      );

      const formattedAmount = formatCurrencyUnit(unit, BigNumber(validator.amount), {
        disableRounding: true,
        alwaysShowSign: false,
        showCode: true,
        discreet,
      });

      return (
        <>
          <B />
          <OpDetailsData>
            <OpDetailsTitle>
              <Trans i18nKey={"operationDetails.extra.undelegatedFrom"} />
            </OpDetailsTitle>
            <Address onClick={redirectAddress(currency, validator.address)}>
              {formattedValidator ? formattedValidator.name : validator.address}
            </Address>
          </OpDetailsData>
          <B />
          <OpDetailsData>
            <OpDetailsTitle>
              <Trans i18nKey={"operationDetails.extra.undelegatedAmount"} />
            </OpDetailsTitle>
            {formattedAmount}
          </OpDetailsData>
        </>
      );
    }
    case "REDELEGATE": {
      const { validator, cosmosSourceValidator } = extra;
      if (!validator || !cosmosSourceValidator) return null;

      const formattedValidator = cosmosValidators.find(
        v => v.validatorAddress === validator.address,
      );

      const formattedSourceValidator = cosmosValidators.find(
        v => v.validatorAddress === cosmosSourceValidator,
      );

      const formattedAmount = formatCurrencyUnit(unit, BigNumber(validator.amount), {
        disableRounding: true,
        alwaysShowSign: false,
        showCode: true,
        discreet,
      });

      return (
        <>
          <B />
          <OpDetailsData>
            <OpDetailsTitle>
              <Trans i18nKey={"operationDetails.extra.redelegatedFrom"} />
            </OpDetailsTitle>
            <Address onClick={redirectAddress(currency, cosmosSourceValidator)}>
              {formattedSourceValidator ? formattedSourceValidator.name : cosmosSourceValidator}
            </Address>
          </OpDetailsData>
          <B />

          <OpDetailsData>
            <OpDetailsTitle>
              <Trans i18nKey={"operationDetails.extra.redelegatedTo"} />
            </OpDetailsTitle>
            <Address onClick={redirectAddress(currency, validator.address)}>
              {formattedValidator ? formattedValidator.name : validator.address}
            </Address>
          </OpDetailsData>
          <OpDetailsData>
            <OpDetailsTitle>
              <Trans i18nKey={"operationDetails.extra.undelegatedAmount"} />
            </OpDetailsTitle>
            {formattedAmount}
          </OpDetailsData>
        </>
      );
    }
    case "REWARD": {
      const { validator } = extra;
      if (!validator) return null;

      const formattedValidator = cosmosValidators.find(
        v => v.validatorAddress === validator.address,
      );

      const formattedAmount = formatCurrencyUnit(unit, BigNumber(validator.amount), {
        disableRounding: true,
        alwaysShowSign: false,
        showCode: true,
        discreet,
      });

      return (
        <>
          <B />
          <OpDetailsData>
            <OpDetailsTitle>
              <Trans i18nKey={"operationDetails.extra.rewardFrom"} />
            </OpDetailsTitle>
            <Address onClick={redirectAddress(currency, validator.address)}>
              {formattedValidator ? formattedValidator.name : validator.address}
            </Address>
          </OpDetailsData>
          <B />
          <OpDetailsData>
            <OpDetailsTitle>
              <Trans i18nKey={"operationDetails.extra.rewardAmount"} />
            </OpDetailsTitle>
            {formattedAmount}
          </OpDetailsData>
        </>
      );
    }
    default:
      return null;
  }
};

type Props = {
  operation: Operation,
  currency: Currency,
  unit: Unit,
};

const DelegateAmountCell = ({ operation, currency, unit }: Props) => {
  const discreet = useDiscreetMode();
  const amount =
    operation.extra && operation.extra.validators
      ? operation.extra.validators.reduce((sum, { amount }) => sum.plus(amount), BigNumber(0))
      : BigNumber(0);

  if (amount.isZero()) return;

  const formattedAmount = formatCurrencyUnit(unit, amount, {
    disableRounding: false,
    alwaysShowSign: false,
    showCode: false,
    discreet,
  });

  return (
    <Text ff="Inter|SemiBold" fontSize={4}>
      <Trans i18nKey={"operationDetails.extra.delegated"} values={{ amount: formattedAmount }} />
    </Text>
  );
};

const RedelegateAmountCell = ({ operation, currency, unit }: Props) => {
  const discreet = useDiscreetMode();
  const amount =
    operation.extra && operation.extra.validator
      ? BigNumber(operation.extra.validator.amount)
      : BigNumber(0);

  if (amount.isZero()) return null;

  const formattedAmount = formatCurrencyUnit(unit, amount, {
    disableRounding: false,
    alwaysShowSign: false,
    showCode: false,
    discreet,
  });

  return amount > 0 ? (
    <Text ff="Inter|SemiBold" fontSize={4}>
      <Trans i18nKey={"operationDetails.extra.redelegated"} values={{ amount: formattedAmount }} />
    </Text>
  ) : null;
};

const UndelegateAmountCell = ({ operation, currency, unit }: Props) => {
  const discreet = useDiscreetMode();
  const amount =
    operation.extra && operation.extra.validator
      ? BigNumber(operation.extra.validator.amount)
      : BigNumber(0);

  if (amount.isZero()) return null;

  const formattedAmount = formatCurrencyUnit(unit, amount, {
    disableRounding: false,
    alwaysShowSign: false,
    showCode: false,
    discreet,
  });

  return amount > 0 ? (
    <Text ff="Inter|SemiBold" fontSize={4}>
      <Trans i18nKey={"operationDetails.extra.undelegated"} values={{ amount: formattedAmount }} />
    </Text>
  ) : null;
};

const amountCell = {
  DELEGATE: DelegateAmountCell,
  REDELEGATE: RedelegateAmountCell,
  UNDELEGATE: UndelegateAmountCell,
};

export default {
  getURLFeesInfo,
  getURLWhatIsThis,
  OperationDetailsExtra,
  amountCell,
};

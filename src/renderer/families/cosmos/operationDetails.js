/* eslint-disable consistent-return */
// @flow
import { BigNumber } from "bignumber.js";
import React, { useMemo } from "react";
import type { ComponentType } from "react";
import { useSelector } from "react-redux";
import { Trans } from "react-i18next";
import { getAccountCurrency, getAccountUnit } from "@ledgerhq/live-common/lib/account";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";
import { getDefaultExplorerView, getAddressExplorer } from "@ledgerhq/live-common/lib/explorers";
import { useCosmosPreloadData } from "@ledgerhq/live-common/lib/families/cosmos/react";
import type {
  CosmosDelegationInfo,
  CosmosValidatorItem,
} from "@ledgerhq/live-common/lib/families/cosmos/types";
import { mapDelegationInfo } from "@ledgerhq/live-common/lib/families/cosmos/logic";
import type { Currency, Unit, Operation, Account } from "@ledgerhq/live-common/lib/types";

import { urls } from "~/config/urls";
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
import FormattedVal from "~/renderer/components/FormattedVal";
import CounterValue from "~/renderer/components/CounterValue";
import { useDiscreetMode } from "~/renderer/components/Discreet";
import { localeSelector } from "~/renderer/reducers/settings";

function getURLFeesInfo(op: Operation): ?string {
  if (op.fee.gt(200000)) {
    return urls.cosmosStakingRewards;
  }
}

function getURLWhatIsThis(op: Operation): ?string {
  if (op.type !== "IN" && op.type !== "OUT") {
    return urls.cosmosStakingRewards;
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
  const locale = useSelector(localeSelector);
  const { validators: cosmosValidators } = useCosmosPreloadData();

  const formatConfig = {
    disableRounding: true,
    alwaysShowSign: false,
    showCode: true,
    discreet,
    locale,
  };

  let ret = null;

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
      const { validators } = extra;
      if (!validators || validators.length <= 0) return null;

      const validator = extra.validators[0];

      const formattedValidator = cosmosValidators.find(
        v => v.validatorAddress === validator.address,
      );

      const formattedAmount = formatCurrencyUnit(unit, BigNumber(validator.amount), formatConfig);

      ret = (
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
      break;
    }
    case "REDELEGATE": {
      const { cosmosSourceValidator, validators } = extra;
      if (!validators || validators.length <= 0 || !cosmosSourceValidator) return null;

      const validator = extra.validators[0];

      const formattedValidator = cosmosValidators.find(
        v => v.validatorAddress === validator.address,
      );

      const formattedSourceValidator = cosmosValidators.find(
        v => v.validatorAddress === cosmosSourceValidator,
      );

      const formattedAmount = formatCurrencyUnit(unit, BigNumber(validator.amount), formatConfig);

      ret = (
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
              <Trans i18nKey={"operationDetails.extra.redelegatedAmount"} />
            </OpDetailsTitle>
            {formattedAmount}
          </OpDetailsData>
        </>
      );
      break;
    }
    case "REWARD": {
      const { validators } = extra;
      if (!validators || validators.length <= 0) return null;

      const validator = extra.validators[0];

      const formattedValidator = cosmosValidators.find(
        v => v.validatorAddress === validator.address,
      );

      ret = (
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
        </>
      );
      break;
    }
    default:
      break;
  }

  return (
    <>
      {ret}
      {extra.memo && (
        <>
          <B />
          <OpDetailsData>
            <OpDetailsTitle>
              <Trans i18nKey={"operationDetails.extra.memo"} />
            </OpDetailsTitle>
            {extra.memo}
          </OpDetailsData>
        </>
      )}
    </>
  );
};

type Props = {
  operation: Operation,
  currency: Currency,
  unit: Unit,
};

const RedelegateAmountCell = ({ operation, currency, unit }: Props) => {
  const amount =
    operation.extra && operation.extra.validators
      ? BigNumber(operation.extra.validators[0].amount)
      : BigNumber(0);

  return (
    !amount.isZero() && (
      <>
        <FormattedVal
          val={amount}
          unit={unit}
          showCode
          fontSize={4}
          color={"palette.text.shade80"}
        />

        <CounterValue
          color="palette.text.shade60"
          fontSize={3}
          date={operation.date}
          currency={currency}
          value={amount}
        />
      </>
    )
  );
};

const UndelegateAmountCell = ({ operation, currency, unit }: Props) => {
  const amount =
    operation.extra && operation.extra.validators
      ? BigNumber(operation.extra.validators[0].amount)
      : BigNumber(0);

  return (
    !amount.isZero() && (
      <>
        <FormattedVal
          val={amount}
          unit={unit}
          showCode
          fontSize={4}
          color={"palette.text.shade80"}
        />

        <CounterValue
          color="palette.text.shade60"
          fontSize={3}
          date={operation.date}
          currency={currency}
          value={amount}
        />
      </>
    )
  );
};

const amountCellExtra: { [key: string]: ComponentType<any> } = {
  REDELEGATE: RedelegateAmountCell,
  UNDELEGATE: UndelegateAmountCell,
};

export default {
  getURLFeesInfo,
  getURLWhatIsThis,
  OperationDetailsExtra,
  amountCellExtra,
};

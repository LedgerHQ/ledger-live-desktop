/* eslint-disable consistent-return */
// @flow
import React, { useMemo } from "react";

import { BigNumber } from "bignumber.js";

import type { Currency, Unit, Operation, Account } from "@ledgerhq/live-common/lib/types";

import { getDefaultExplorerView, getAddressExplorer } from "@ledgerhq/live-common/lib/explorers";

import { openURL } from "~/renderer/linking";

import {
  OpDetailsTitle,
  Address,
  OpDetailsData,
  OpDetailsVoteData,
} from "~/renderer/modals/OperationDetails/styledComponents";
import { Trans } from "react-i18next";
import Box from "~/renderer/components/Box/Box";
import { usePolkadotPreloadData } from "@ledgerhq/live-common/lib/families/polkadot/react";
import Text from "~/renderer/components/Text";
import FormattedVal from "~/renderer/components/FormattedVal";
import CounterValue from "~/renderer/components/CounterValue";

const helpURL = "https://support.ledger.com/hc/en-us/articles/FIXME";

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

type OperationsDetailsValidatorsProps = {
  validators: string[],
  account: Account,
  isTransactionField?: boolean,
};

export const OperationDetailsValidators = ({
  validators,
  account,
  isTransactionField,
}: OperationsDetailsValidatorsProps) => {
  const { currency } = account;

  const { validators: polkadotValidators } = usePolkadotPreloadData();

  const mappedValidators = useMemo(
    () =>
      (validators || [])
        .map(address => polkadotValidators.find(v => v.address === address))
        .filter(Boolean),
    [validators, polkadotValidators],
  );

  return (
    <Box>
      {!isTransactionField && (
        <OpDetailsTitle>
          <Trans i18nKey={"operationDetails.extra.validators"} />
        </OpDetailsTitle>
      )}

      {mappedValidators.map(({ address, identity }, i) => (
        <OpDetailsData key={address + i}>
          <OpDetailsVoteData>
            <Box>
              <Text ff="Inter|SemiBold">{identity ?? address}</Text>
            </Box>
            <Address onClick={redirectAddress(currency, address)}>{address}</Address>
          </OpDetailsVoteData>
        </OpDetailsData>
      ))}
    </Box>
  );
};

type OperationsDetailsRewardFromProps = {
  validatorStash: string,
  account: Account,
  isTransactionField?: boolean,
};

export const OperationsDetailsRewardFrom = ({
  validatorStash,
  account,
  isTransactionField,
}: OperationsDetailsRewardFromProps) => {
  const { currency } = account;

  const { validators: polkadotValidators } = usePolkadotPreloadData();

  const validator = useMemo(() => polkadotValidators.find(v => v.address === validatorStash), [
    validatorStash,
    polkadotValidators,
  ]);

  return (
    <Box>
      <OpDetailsTitle>
        <Trans i18nKey={"operationDetails.extra.rewardFrom"} />
      </OpDetailsTitle>
      <OpDetailsData>
        <Address onClick={redirectAddress(currency, validatorStash)}>
          {validator ? validator.identity ?? validator.address : validatorStash}
        </Address>
      </OpDetailsData>
    </Box>
  );
};

type OperationsDetailsPalletMethodProps = {
  palletMethod: string,
};

export const OperationsDetailsPalletMethod = ({
  palletMethod,
}: OperationsDetailsPalletMethodProps) => {
  return (
    <Box>
      <OpDetailsTitle>
        <Trans i18nKey={"operationDetails.extra.palletMethod"} />
      </OpDetailsTitle>
      <OpDetailsData>{palletMethod}</OpDetailsData>
    </Box>
  );
};

type OperationDetailsExtraProps = {
  extra: { [key: string]: any },
  type: string,
  account: Account,
};

const OperationDetailsExtra = ({ extra, type, account }: OperationDetailsExtraProps) => {
  switch (type) {
    case "OUT":
    case "IN":
      return (
        <>
          <OperationsDetailsPalletMethod palletMethod={extra.palletMethod} />
          <Box>
            <OpDetailsTitle>
              <Trans i18nKey="operationDetails.extra.transferAmount" />
            </OpDetailsTitle>
            <OpDetailsData>
              <FormattedVal
                val={BigNumber(extra.transferAmount)}
                unit={account.unit}
                showCode
                fontSize={4}
                color="palette.text.shade60"
              />
            </OpDetailsData>
          </Box>
        </>
      );
    case "NOMINATE": {
      const { validators } = extra;
      if (!validators || !validators.length) return null;

      return (
        <>
          <OperationsDetailsPalletMethod palletMethod={extra.palletMethod} />
          <Box>
            <OperationDetailsValidators validators={validators} account={account} />
          </Box>
        </>
      );
    }
    case "BOND":
      return (
        <>
          <OperationsDetailsPalletMethod palletMethod={extra.palletMethod} />
          {extra.bondedAmount ? (
            <Box>
              <OpDetailsTitle>
                <Trans i18nKey="operationDetails.extra.bondedAmount" />
              </OpDetailsTitle>
              <OpDetailsData>
                <FormattedVal
                  val={BigNumber(extra.bondedAmount)}
                  unit={account.unit}
                  showCode
                  fontSize={4}
                  color="palette.text.shade60"
                />
              </OpDetailsData>
            </Box>
          ) : null}
        </>
      );
    case "UNBOND":
      return (
        <>
          <OperationsDetailsPalletMethod palletMethod={extra.palletMethod} />
          <Box>
            <OpDetailsTitle>
              <Trans i18nKey="operationDetails.extra.unbondedAmount" />
            </OpDetailsTitle>
            <OpDetailsData>
              <FormattedVal
                val={BigNumber(extra.unbondedAmount)}
                unit={account.unit}
                showCode
                fontSize={4}
                color="palette.text.shade60"
              />
            </OpDetailsData>
          </Box>
        </>
      );
    case "REWARD":
      return (
        <>
          <OperationsDetailsPalletMethod palletMethod={extra.palletMethod} />
          {extra.validatorStash ? (
            <OperationsDetailsRewardFrom validatorStash={extra.validatorStash} account={account} />
          ) : null}
        </>
      );
    default:
      return <OperationsDetailsPalletMethod palletMethod={extra.palletMethod} />;
  }
};

type Props = {
  operation: Operation,
  currency: Currency,
  unit: Unit,
};

const TransferAmountCell = ({ operation, currency, unit }: Props) => {
  const amount = new BigNumber(operation.extra ? operation.extra.transferAmount : 0);

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

const BondAmountCell = ({ operation, currency, unit }: Props) => {
  const amount = new BigNumber(operation.extra ? operation.extra.bondedAmount : 0);

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

const UnbondAmountCell = ({ operation, currency, unit }: Props) => {
  const amount = new BigNumber(operation.extra ? operation.extra.unbondedAmount : 0);

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

const amountCellExtra = {
  OUT: TransferAmountCell,
  BOND: BondAmountCell,
  UNBOND: UnbondAmountCell,
};

export default {
  getURLFeesInfo,
  getURLWhatIsThis,
  OperationDetailsExtra,
  amountCellExtra,
};

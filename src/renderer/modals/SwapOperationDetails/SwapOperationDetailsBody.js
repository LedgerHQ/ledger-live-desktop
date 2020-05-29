// @flow
import React from "react";
import { Trans } from "react-i18next";
import { ModalBody } from "~/renderer/components/Modal";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import Text from "~/renderer/components/Text";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import FormattedVal from "~/renderer/components/FormattedVal";
import type { MappedSwapOperation } from "@ledgerhq/live-common/lib/swap/types";
import {
  getAccountUnit,
  getAccountCurrency,
  getAccountName,
} from "@ledgerhq/live-common/lib/account";
import styled from "styled-components";
import IconSwap from "~/renderer/icons/Swap";
import IconArrowDown from "~/renderer/icons/ArrowDown";
import { rgba } from "~/renderer/styles/helpers";
import moment from "moment";

const Label = styled(Text).attrs(() => ({
  fontSize: 2,
  color: "palette.text.shade100",
  ff: "Inter|SemiBold",
}))`
  text-transform: uppercase;
`;

const Value = styled(Text).attrs(() => ({
  fontSize: 4,
  color: "palette.text.shade50",
  ff: "Inter|Regular",
}))`
  margin-top: 2px;
`;

const Row = styled(Box).attrs(() => ({
  horizontal: true,
  py: 24,
}))`
  &:not(:last-child) {
    border-bottom: 1px solid ${p => p.theme.colors.palette.text.shade10};
  }
  & > * {
    flex: 50%;
    align-items: flex-start;
  }
`;

const IconWrapper = styled.div`
  border-radius: 50%;
  height: 66px;
  width: 66px;
  background: ${p => rgba(p.theme.colors.positiveGreen, 0.1)};
  color: ${p => p.theme.colors.positiveGreen};
  display: flex;
  align-items: center;
  align-self: center;
  justify-content: center;
`;

const SwapOperationDetailsBody = ({
  mappedSwapOperation,
  onClose,
}: {
  mappedSwapOperation: MappedSwapOperation,
  onClose: () => void,
}) => {
  const {
    fromAccount,
    toAccount,
    operation,
    provider,
    swapId,
    status,
    fromAmount,
    toAmount,
  } = mappedSwapOperation;
  /*
  {
  fromAccount: AccountLike,
  fromParentAccount?: Account,
  toAccount: AccountLike,
  toParentAccount?: Account,

  operation: Operation,
  provider: string,
  swapId: string,
  status: string,
  fromAmount: BigNumber,
  toAmount: BigNumber
}
 */
  const fromUnit = getAccountUnit(fromAccount);
  const fromCurrency = getAccountCurrency(fromAccount);
  const toUnit = getAccountUnit(toAccount);
  const toCurrency = getAccountCurrency(toAccount);
  const normalisedFromAmount = fromAmount.times(-1);

  return (
    <ModalBody
      onClose={onClose}
      title={<Trans i18nKey="swap.operationDetailsModal.title" />}
      render={() => (
        <Box>
          <IconWrapper>
            <IconSwap size={27} />
          </IconWrapper>
          <Box my={4} mb={48} alignItems="center">
            <Box selectable>
              <FormattedVal
                color={normalisedFromAmount.isNegative() ? "palette.text.shade80" : undefined}
                unit={fromUnit}
                alwaysShowSign
                showCode
                val={normalisedFromAmount}
                fontSize={6}
                disableRounding
              />
            </Box>
            <Box my={12}>
              <IconArrowDown size={16} />
            </Box>
            <Box selectable>
              <FormattedVal
                color={toAmount.isNegative() ? "palette.text.shade80" : undefined}
                unit={toUnit}
                alwaysShowSign
                showCode
                val={toAmount}
                fontSize={6}
                disableRounding
              />
            </Box>
          </Box>
          <Row>
            <Box>
              <Label>
                <Trans i18nKey="swap.operationDetailsModal.provider" />
              </Label>
              <Value>{provider}</Value>
            </Box>
            <Box>
              <Label>
                <Trans i18nKey="swap.operationDetailsModal.txid" />
              </Label>
              <Value>{swapId}</Value>
            </Box>
          </Row>
          <Row>
            <Box>
              <Label>
                <Trans i18nKey="swap.operationDetailsModal.status" />
              </Label>
              <Value>{status}</Value>
            </Box>
            <Box>
              <Label>
                <Trans i18nKey="swap.operationDetailsModal.date" />
              </Label>
              <Value>{moment(operation.date).format("MMMM, Do, YYYY")}</Value>
            </Box>
          </Row>
          <Row>
            <Box>
              <Label>
                <Trans i18nKey="swap.operationDetailsModal.from" />
              </Label>
              <Box horizontal alignItems={"center"}>
                <Box mr={1}>
                  <CryptoCurrencyIcon size={16} currency={fromCurrency} />
                </Box>
                <Value>{getAccountName(fromAccount)}</Value>
              </Box>
            </Box>
            <Box>
              <Label>
                <Trans i18nKey="swap.operationDetailsModal.initialAmount" />
              </Label>
              <Value>
                <FormattedVal
                  unit={fromUnit}
                  showCode
                  val={fromAmount}
                  disableRounding
                  color={"palette.text.shade50"}
                />
              </Value>
            </Box>
          </Row>
          <Row>
            <Box>
              <Label>
                <Trans i18nKey="swap.operationDetailsModal.to" />
              </Label>
              <Box horizontal alignItems={"center"}>
                <Box mr={1}>
                  <CryptoCurrencyIcon size={16} currency={toCurrency} />
                </Box>
                <Value>{getAccountName(toAccount)}</Value>
              </Box>
            </Box>
            <Box>
              <Label>
                <Trans i18nKey="swap.operationDetailsModal.creditedAmount" />
              </Label>
              <Value>
                <FormattedVal
                  unit={toUnit}
                  showCode
                  val={toAmount}
                  fotSize={6}
                  disableRounding
                  color={"palette.text.shade50"}
                />
              </Value>
            </Box>
          </Row>
        </Box>
      )}
      renderFooter={() => (
        <Box alignItems={"flex-end"}>
          <Button primary onClick={onClose}>
            <Text>{"Close"}</Text>
          </Button>
        </Box>
      )}
    />
  );
};
export default SwapOperationDetailsBody;

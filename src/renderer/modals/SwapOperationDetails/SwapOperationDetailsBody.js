// @flow
import React from "react";
import { Trans } from "react-i18next";
import { ModalBody } from "~/renderer/components/Modal";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import CopyWithFeedback from "~/renderer/components/CopyWithFeedback";
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
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import moment from "moment";
import { getStatusColor } from "~/renderer/screens/swap/history/OperationRow";
import IconClock from "~/renderer/icons/Clock";
import { GradientHover } from "~/renderer/modals/OperationDetails/styledComponents";

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

const Status: ThemedComponent<{}> = styled.div`
  height: 66px;
  width: 66px;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  align-self: center;
  border-radius: 50%;
  background: ${p => rgba(getStatusColor(p.status, p.theme), 0.2)};
  & > * {
    color: ${p => getStatusColor(p.status, p.theme)};
  }
`;

const WrapperClock: ThemedComponent<{}> = styled(Box).attrs(() => ({
  bg: "palette.background.paper",
  color: "palette.text.shade60",
}))`
  border-radius: 50%;
  position: absolute;
  bottom: -4px;
  right: -4px;
  padding: 1px;
`;

const SwapIdWrapper: ThemedComponent<{}> = styled(Box).attrs(p => ({
  ff: "Inter",
  color: p.color || "palette.text.shade80",
  fontSize: 4,
  relative: true,
}))`
  width: 100%;

  ${GradientHover} {
    display: none;
  }

  &:hover ${GradientHover} {
    display: flex;
    & > * {
      cursor: pointer;
    }
  }

  &:hover ${Value} {
    color: ${p => p.theme.colors.palette.text.shade100};
    font-weight: 400;
  }
}
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
        <Box p={1}>
          <Status status={status}>
            <IconSwap size={27} />
            {status !== "confirming" ? (
              <WrapperClock>
                <IconClock size={16} />
              </WrapperClock>
            ) : null}
          </Status>
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
            <Box my={12} color={"palette.text.shade50"}>
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
              <SwapIdWrapper selectable>
                <Value>{swapId}</Value>
                <GradientHover>
                  <CopyWithFeedback text={swapId} />
                </GradientHover>
              </SwapIdWrapper>
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

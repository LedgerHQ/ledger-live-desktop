// @flow
import React, { useCallback } from "react";
import moment from "moment";
import { Trans } from "react-i18next";
import { useSelector } from "react-redux";
import type { MappedSwapOperation } from "@ledgerhq/live-common/lib/exchange/swap/types";
import {
  getAccountUnit,
  getAccountCurrency,
  getAccountName,
  getMainAccount,
} from "@ledgerhq/live-common/lib/account";
import { operationStatusList } from "@ledgerhq/live-common/lib/exchange/swap";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { ModalBody } from "~/renderer/components/Modal";
import Box from "~/renderer/components/Box";
import Link from "~/renderer/components/Link";
import Ellipsis from "~/renderer/components/Ellipsis";
import Button from "~/renderer/components/Button";
import CopyWithFeedback from "~/renderer/components/CopyWithFeedback";
import Text from "~/renderer/components/Text";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import FormattedVal from "~/renderer/components/FormattedVal";
import { shallowAccountsSelector } from "~/renderer/reducers/accounts";
import IconSwap from "~/renderer/icons/Swap";
import IconArrowDown from "~/renderer/icons/ArrowDown";
import { rgba } from "~/renderer/styles/helpers";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { getStatusColor } from "~/renderer/screens/exchange/swap/History/OperationRow";
import IconClock from "~/renderer/icons/Clock";
import { GradientHover } from "~/renderer/modals/OperationDetails/styledComponents";

const Label = styled(Text).attrs(() => ({
  fontSize: 2,
  color: "palette.text.shade100",
  ff: "Inter|SemiBold",
}))`
  text-transform: uppercase;
`;

const Value = styled(Box).attrs(() => ({
  fontSize: 4,
  color: "palette.text.shade50",
  ff: "Inter|Regular",
}))`
  margin-top: 2px;
  flex: 1;
  & ${Link}:hover {
    text-decoration: underline;
  }
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
    overflow: hidden;
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

  const history = useHistory();
  const fromUnit = getAccountUnit(fromAccount);
  const fromCurrency = getAccountCurrency(fromAccount);
  const toUnit = getAccountUnit(toAccount);
  const toCurrency = getAccountCurrency(toAccount);
  const accounts = useSelector(shallowAccountsSelector);
  const normalisedFromAmount = fromAmount.times(-1);

  const openAccount = useCallback(
    account => {
      const parentAccount =
        account.type !== "Account" ? accounts.find(a => a.id === account.parentId) : null;
      const mainAccount = getMainAccount(account, parentAccount);

      const url = `/account/${mainAccount.id}/${parentAccount ? account.id : ""}`;
      history.push({ pathname: url, state: { source: "swap operation details" } });
      onClose();
    },
    [accounts, history, onClose],
  );

  return (
    <ModalBody
      onClose={onClose}
      title={<Trans i18nKey="swap.operationDetailsModal.title" />}
      render={() => (
        <Box p={1}>
          <Status status={status}>
            <IconSwap size={27} />
            {operationStatusList.pending.includes(status) ? (
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
              <Value style={{ textTransform: "capitalize" }}>{provider}</Value>
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
              <Value style={{ textTransform: "capitalize" }}>{status}</Value>
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
              <Value horizontal alignItems={"center"} style={{ width: "100%" }}>
                <Box mr={1} alignItems={"center"}>
                  <CryptoCurrencyIcon size={16} currency={fromCurrency} />
                </Box>
                <Box flex={1}>
                  <Ellipsis>
                    <Link onClick={() => openAccount(fromAccount)}>
                      {getAccountName(fromAccount)}
                    </Link>
                  </Ellipsis>
                </Box>
              </Value>
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
              <Value horizontal alignItems={"center"} style={{ width: "100%" }}>
                <Box mr={1} alignItems={"center"}>
                  <CryptoCurrencyIcon size={16} currency={toCurrency} />
                </Box>
                <Box flex={1}>
                  <Ellipsis>
                    <Link onClick={() => openAccount(toAccount)}>{getAccountName(toAccount)}</Link>
                  </Ellipsis>
                </Box>
              </Value>
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

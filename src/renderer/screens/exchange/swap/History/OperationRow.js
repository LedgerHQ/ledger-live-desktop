// @flow

import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import FormattedVal from "~/renderer/components/FormattedVal";
import {
  getAccountCurrency,
  getAccountUnit,
  getAccountName,
} from "@ledgerhq/live-common/lib/account";
import React from "react";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import styled from "styled-components";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import Ellipsis from "~/renderer/components/Ellipsis";
import IconArrowRight from "~/renderer/icons/ArrowRight";
import IconSwap from "~/renderer/icons/Swap";

import moment from "moment";
import { rgba } from "~/renderer/styles/helpers";
import type { MappedSwapOperation } from "@ledgerhq/live-common/lib/exchange/swap/types";
import { operationStatusList } from "@ledgerhq/live-common/lib/exchange/swap";
import Tooltip from "~/renderer/components/Tooltip";
import IconClock from "~/renderer/icons/Clock";

export const getStatusColor = (status: string, theme: any) => {
  if (operationStatusList.pending.includes(status)) {
    return theme.colors.gray;
  } else if (operationStatusList.finishedOK.includes(status)) {
    return theme.colors.positiveGreen;
  } else if (operationStatusList.finishedKO.includes(status)) {
    return theme.colors.alertRed;
  } else {
    return theme.colors.palette.shade50;
  }
};

const Status: ThemedComponent<{}> = styled.div`
  height: 24px;
  width: 24px;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  border-radius: 24px;
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

const Row: ThemedComponent<{}> = styled(Box)`
  border-bottom: 1px solid ${p => p.theme.colors.palette.divider};
  height: 68px;
  opacity: ${p => (p.isOptimistic || !p.toExists ? 0.5 : 1)};
  cursor: pointer;

  &:last-child {
    border-bottom: 0;
  }

  &:hover {
    background: ${p => rgba(p.theme.colors.wallet, 0.04)};
  }

  padding: 24px;
  & > *:nth-child(2) {
    flex: 10%;
  }
  & > *:nth-child(6) {
    flex: 20%;
  }
  & > *:nth-child(3),
  & > *:nth-child(5) {
    flex: 20%;
  }
  &:not(:last-child) {
    border-bottom: 1px solid ${p => p.theme.colors.palette.divider};
  }
`;

const OperationRow = ({
  mappedSwapOperation,
  openSwapOperationDetailsModal,
}: {
  mappedSwapOperation: MappedSwapOperation,
  openSwapOperationDetailsModal: MappedSwapOperation => void,
}) => {
  const {
    fromAccount,
    toAccount,
    fromAmount,
    toAmount,
    provider,
    swapId,
    operation,
    status,
    toExists,
  } = mappedSwapOperation;
  const fromCurrency = getAccountCurrency(fromAccount);
  const toCurrency = getAccountCurrency(toAccount);

  return (
    <Row
      toExists={toExists}
      horizontal
      key={swapId}
      alignItems={"center"}
      onClick={() => openSwapOperationDetailsModal(mappedSwapOperation)}
    >
      <Tooltip content={<span style={{ textTransform: "capitalize" }}>{status}</span>}>
        <Status status={status}>
          <IconSwap size={12} />
          {operationStatusList.pending.includes(status) ? (
            <WrapperClock>
              <IconClock size={10} />
            </WrapperClock>
          ) : null}
        </Status>
      </Tooltip>
      <Box ml={24}>
        <Text
          ff={"Inter|SemiBold"}
          color={"palette.text.shade100"}
          style={{ textTransform: "capitalize" }}
          fontSize={3}
        >
          {provider}
        </Text>
        <Text ff={"Inter|Regular"} color={"palette.text.shade50"} fontSize={3}>
          {moment(operation.date).format("HH:mm")}
        </Text>
      </Box>
      <Box horizontal mx={20}>
        <Box alignItems="center" justifyContent="center">
          <CryptoCurrencyIcon size={16} currency={fromCurrency} />
        </Box>
        <Tooltip delay={1200} content={getAccountName(fromAccount)}>
          <Ellipsis ff="Inter|SemiBold" ml={1} color="palette.text.shade100" fontSize={3}>
            {getAccountName(fromAccount)}
          </Ellipsis>
        </Tooltip>
      </Box>
      <Box color={"palette.text.shade30"}>
        <IconArrowRight size={16} />
      </Box>
      <Box horizontal mx={20}>
        <Box alignItems="center" justifyContent="center">
          <CryptoCurrencyIcon size={16} currency={toCurrency} />
        </Box>
        <Tooltip delay={1200} content={getAccountName(toAccount)}>
          <Ellipsis ff="Inter|SemiBold" ml={1} color="palette.text.shade100" fontSize={3}>
            {getAccountName(toAccount)}
          </Ellipsis>
        </Tooltip>
      </Box>
      <Box alignItems={"flex-end"} ml={20}>
        <Text ff={"Inter|SemiBold"} fontSize={4}>
          <FormattedVal alwaysShowSign val={toAmount} unit={getAccountUnit(toAccount)} showCode />
        </Text>
        <Text ff={"Inter|SemiBold"} fontSize={3}>
          <FormattedVal
            color="palette.text.shade60"
            alwaysShowSign
            val={fromAmount.times(-1)}
            unit={getAccountUnit(fromAccount)}
            showCode
          />
        </Text>
      </Box>
    </Row>
  );
};

export default OperationRow;

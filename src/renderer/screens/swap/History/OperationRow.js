// @flow

import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import FormattedVal from "~/renderer/components/FormattedVal";
import {
  getAccountCurrency,
  getAccountUnit,
  getAccountName,
} from "@ledgerhq/live-common/lib/account";
import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import styled from "styled-components";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import IconArrowRight from "~/renderer/icons/ArrowRight";
import IconSwap from "~/renderer/icons/Swap";

import moment from "moment";
import { rgba } from "~/renderer/styles/helpers";
import type { MappedSwapOperation } from "@ledgerhq/live-common/lib/swap/types";
import Tooltip from "~/renderer/components/Tooltip";
import IconClock from "~/renderer/icons/Clock";
import { openModal } from "~/renderer/actions/modals";

const getStatusColor = (status, theme) => {
  return (
    {
      finished: theme.colors.positiveGreen,
      new: theme.colors.gray,
      failed: theme.colors.alertRed,
    }[status] || theme.colors.palette.shade50
  );
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
  } = mappedSwapOperation;
  const fromCurrency = getAccountCurrency(fromAccount);
  const toCurrency = getAccountCurrency(toAccount);

  return (
    <Row
      horizontal
      key={swapId}
      alignItems={"center"}
      onClick={() => openSwapOperationDetailsModal(mappedSwapOperation)}
    >
      <Tooltip content={status}>
        <Status status={status}>
          <IconSwap size={12} />
          {status === "confirming" ? (
            <WrapperClock>
              <IconClock size={10} />
            </WrapperClock>
          ) : null}
        </Status>
      </Tooltip>
      <Box ml={24}>
        <Text
          ff={"Inter|Regular"}
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
        <CryptoCurrencyIcon size={16} currency={fromCurrency} />
        <Text ml={1} ff={"Inter|Regular"} color={"palette.text.shade100"} fontSize={4}>
          {getAccountName(fromAccount)}
        </Text>
      </Box>
      <Box color={"palette.text.shade30"}>
        <IconArrowRight size={16} />
      </Box>
      <Box horizontal ml={20}>
        <CryptoCurrencyIcon size={16} currency={toCurrency} />
        <Text ml={1} ff={"Inter|Regular"} color={"palette.text.shade100"} fontSize={4}>
          {getAccountName(toAccount)}
        </Text>
      </Box>
      <Box alignItems={"flex-end"} ml={20}>
        <Text ff={"Inter|SemiBold"} fontSize={4}>
          <FormattedVal alwaysShowSign val={toAmount} unit={getAccountUnit(toAccount)} showCode />
        </Text>
        <Text ff={"Inter|SemiBold"} fontSize={3}>
          <FormattedVal
            color="palette.text.shade50"
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

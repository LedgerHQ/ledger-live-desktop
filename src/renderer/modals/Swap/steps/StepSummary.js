// @flow

import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import { Trans } from "react-i18next";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import Ellipsis from "~/renderer/components/Ellipsis";
import {
  getAccountCurrency,
  getAccountName,
  getAccountUnit,
} from "@ledgerhq/live-common/lib/account";
import CurrencyUnitValue from "~/renderer/components/CurrencyUnitValue";
import ArrowSeparator from "~/renderer/components/ArrowSeparator";
import CheckBox from "~/renderer/components/CheckBox";
import Tooltip from "~/renderer/components/Tooltip";
import React from "react";
import type {
  Exchange,
  ExchangeRate,
  SwapOperation,
  SwapState,
} from "@ledgerhq/live-common/lib/swap/types";
import Button from "~/renderer/components/Button";
import IconWallet from "~/renderer/icons/Wallet";
import IconArrowDown from "~/renderer/icons/ArrowDown";
import styled from "styled-components";
import { colors } from "~/renderer/styles/theme";
import { openURL } from "~/renderer/linking";
import { urls } from "~/config/urls";
import IconExternalLink from "~/renderer/icons/ExternalLink";
import FakeLink from "~/renderer/components/FakeLink";
import CountdownTimer from "~/renderer/components/CountdownTimer";
import { CountdownTimerWrapper } from "../SwapBody";
import IconClock from "~/renderer/icons/Clock";

const IconWrapper = styled(Box)`
  background: ${colors.pillActiveBackground};
  color: ${colors.wallet};
  width: 32px;
  height: 32px;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
`;

const StepSummary = ({
  swap,
  checkedDisclaimer,
  onSwitchAccept,
}: {
  swap: { exchange: Exchange, exchangeRate: ExchangeRate },
  checkedDisclaimer: boolean,
  onSwitchAccept: () => any,
}) => {
  const { exchange, exchangeRate } = swap;
  const { fromAccount, toAccount, fromAmount } = exchange;
  if (!fromAccount || !toAccount || !fromAmount) return null;

  const fromCurrency = getAccountCurrency(fromAccount);
  const toCurrency = getAccountCurrency(toAccount);
  const fromUnit = getAccountUnit(fromAccount);
  const toUnit = getAccountUnit(toAccount);

  const toAmount = fromAmount.times(exchangeRate.magnitudeAwareRate);

  return (
    <Box mx={2}>
      <Box alignItems={"center"} horizontal mb={2}>
        <IconWrapper mr={2}>
          <IconWallet size={14} />
        </IconWrapper>
        <Box>
          <Text mb={1} ff="Inter|Regular" color="palette.text.shade30" fontSize={4}>
            <Trans i18nKey="swap.modal.steps.summary.from" />
          </Text>
          <Box horizontal>
            <CryptoCurrencyIcon size={16} currency={fromCurrency} />
            <Ellipsis ml={1} ff={"Inter|SemiBold"} fontSize={4}>
              {getAccountName(fromAccount)}
            </Ellipsis>
          </Box>
        </Box>
        <Box alignItems={"flex-end"} flex={1}>
          <Text mb={1} ff="Inter|Regular" color="palette.text.shade30" fontSize={4}>
            <Trans i18nKey="swap.modal.steps.summary.toExchange" />
          </Text>
          <Text ff="Inter|Regular" color="palette.text.shade100" fontSize={4}>
            <CurrencyUnitValue value={fromAmount} unit={fromUnit} showCode />
          </Text>
        </Box>
      </Box>
      <ArrowSeparator horizontal Icon={IconArrowDown} />
      <Box alignItems={"center"} horizontal mt={2}>
        <IconWrapper mr={2}>
          <IconWallet size={14} />
        </IconWrapper>
        <Box>
          <Text mb={1} ff="Inter|Regular" color="palette.text.shade30" fontSize={4}>
            <Trans i18nKey="swap.modal.steps.summary.to" />
          </Text>
          <Box horizontal>
            <CryptoCurrencyIcon size={16} currency={toCurrency} />
            <Ellipsis ml={1} ff={"Inter|SemiBold"} fontSize={4}>
              {getAccountName(toAccount)}
            </Ellipsis>
          </Box>
        </Box>
        <Box alignItems={"flex-end"} flex={1}>
          <Text mb={1} ff="Inter|Regular" color="palette.text.shade30" fontSize={4}>
            <Trans i18nKey="swap.modal.steps.summary.toReceive" />
          </Text>
          <Text ff="Inter|Regular" color="palette.text.shade100" fontSize={4}>
            <CurrencyUnitValue value={toAmount} unit={toUnit} showCode />
          </Text>
        </Box>
      </Box>
      <Box horizontal justifyContent={"space-between"} mt={20}>
        <Text ff="Inter|Regular" fontSize={3} color="palette.text.shade50">
          <Trans i18nKey="swap.modal.steps.summary.details.provider" />
        </Text>
        <FakeLink
          underline
          fontSize={3}
          ml={2}
          color="palette.primary.main"
          onClick={() => openURL(urls.swap.providers[exchangeRate.provider])}
          iconFirst
          style={{ textTransform: "capitalize" }}
        >
          {exchangeRate.provider}
          <Box ml={1}>
            <IconExternalLink size={12} />
          </Box>
        </FakeLink>
      </Box>
      <Box mt={6} horizontal alignItems="flex-start" onClick={onSwitchAccept}>
        <CheckBox onClick={onSwitchAccept} isChecked={checkedDisclaimer} />
        <Text
          ff="Inter|Regular"
          fontSize={3}
          color="palette.text.shade50"
          style={{ marginLeft: 12, flex: 1 }}
        >
          <Trans i18nKey="swap.modal.steps.summary.disclaimer.description" />
          <FakeLink
            underline
            fontSize={3}
            ml={2}
            color="palette.primary.main"
            onClick={() => openURL(urls.swap.providers[exchangeRate.provider])}
            iconFirst
            style={{ textTransform: "capitalize", display: "inline-flex" }}
          >
            {"Terms & Conditions"}
            <Box ml={1}>
              <IconExternalLink size={12} />
            </Box>
          </FakeLink>
        </Text>
      </Box>
    </Box>
  );
};

export const StepSummaryFooter = ({
  onContinue,
  onClose,
  disabled,
}: {
  onContinue: any,
  onClose: any,
  disabled: boolean,
}) => (
  <>
    <Box flex={1} alignItems={"flex-start"}>
      <Tooltip content={"Lorem ipsum dolor sit amet ¯_(ツ)_/¯"}>
        <CountdownTimerWrapper>
          <IconClock size={14} />
          <Text ml={2} ff="Inter|SemiBold" fontSize={3} color="palette.text.shade100">
            <CountdownTimer
              end={new Date().getTime() + 1200000}
              callback={() => console.log("asdas")}
            />
          </Text>
        </CountdownTimerWrapper>
      </Tooltip>
    </Box>
    <Button onClick={onClose} secondary data-e2e="modal_buttonClose_swap">
      <Trans i18nKey="common.close" />
    </Button>
    <Button onClick={onContinue} disabled={disabled} primary data-e2e="modal_buttonContinue_swap">
      <Trans i18nKey="common.confirm" />
    </Button>
  </>
);

export default StepSummary;

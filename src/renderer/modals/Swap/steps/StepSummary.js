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
import FormattedVal from "~/renderer/components/FormattedVal";
import ArrowSeparator from "~/renderer/components/ArrowSeparator";
import CheckBox from "~/renderer/components/CheckBox";
import React from "react";
import type { Exchange, ExchangeRate } from "@ledgerhq/live-common/lib/exchange/swap/types";
import { SwapGenericAPIError } from "@ledgerhq/live-common/lib/errors";
import type { Transaction } from "@ledgerhq/live-common/lib/types";
import Button from "~/renderer/components/Button";
import IconWallet from "~/renderer/icons/Wallet";
import IconArrowDown from "~/renderer/icons/ArrowDown";
import styled from "styled-components";
import { colors } from "~/renderer/styles/theme";
import { openURL } from "~/renderer/linking";
import { urls } from "~/config/urls";
import IconExternalLink from "~/renderer/icons/ExternalLink";
import FakeLink from "~/renderer/components/FakeLink";
import { CountdownTimerWrapper } from "~/renderer/screens/exchange/swap/Form/Footer";
import IconClock from "~/renderer/icons/Clock";
import CountdownTimer from "~/renderer/components/CountdownTimer";

const IconWrapper = styled(Box)`
  background: ${colors.pillActiveBackground};
  color: ${colors.wallet};
  width: 32px;
  height: 32px;
  border-radius: 16px;
  align-items: center;
  justify-content: center;
`;

const ProviderWrapper = styled(Box)`
  background: ${p => p.theme.colors.palette.text.shade10};
  padding: 6px 12px;
  border-radius: 4px;
`;

const StepSummary = ({
  swap,
  transaction,
  checkedDisclaimer,
  onSwitchAccept,
}: {
  swap: { exchange: Exchange, exchangeRate: ExchangeRate },
  transaction: Transaction,
  checkedDisclaimer: boolean,
  onSwitchAccept: () => any,
}) => {
  const { exchange, exchangeRate } = swap;
  const { fromAccount, toAccount } = exchange;
  const fromAmount = transaction.amount;
  if (!fromAccount || !toAccount || !fromAmount) return null;

  const fromCurrency = getAccountCurrency(fromAccount);
  const toCurrency = getAccountCurrency(toAccount);
  const fromUnit = getAccountUnit(fromAccount);
  const toUnit = getAccountUnit(toAccount);

  const toAmount = fromAmount.times(exchangeRate.magnitudeAwareRate);
  const { main, tos } = urls.swap.providers[exchangeRate.provider];

  return (
    <Box mx={2}>
      <Box alignItems={"center"} horizontal mb={2}>
        <IconWrapper mr={2}>
          <IconWallet size={14} />
        </IconWrapper>
        <Box flex={1} mr={20}>
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
          <Text ff="Inter|Regular" fontSize={4}>
            <FormattedVal
              disableRounding
              color="palette.text.shade100"
              val={fromAmount}
              unit={fromUnit}
              showCode
            />
          </Text>
        </Box>
      </Box>
      <ArrowSeparator horizontal Icon={IconArrowDown} />
      <Box alignItems={"center"} horizontal mt={2} flow={1}>
        <IconWrapper mr={2}>
          <IconWallet size={14} />
        </IconWrapper>
        <Box flex={1} mr={20}>
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
          <Text ff="Inter|Regular" fontSize={4}>
            <FormattedVal
              disableRounding
              color="palette.text.shade100"
              val={toAmount}
              unit={toUnit}
              showCode
            />
          </Text>
        </Box>
      </Box>
      <ProviderWrapper horizontal justifyContent={"space-between"} mt={20}>
        <Text ff="Inter|Regular" fontSize={3} color="palette.text.shade50">
          <Trans i18nKey="swap.modal.steps.summary.details.provider" />
        </Text>
        <FakeLink
          underline
          fontSize={3}
          ml={2}
          color="palette.primary.main"
          onClick={() => openURL(main)}
          iconFirst
          style={{ textTransform: "capitalize" }}
        >
          {exchangeRate.provider}
          <Box ml={1}>
            <IconExternalLink size={12} />
          </Box>
        </FakeLink>
      </ProviderWrapper>
      <Box mt={6} horizontal alignItems={"center"} onClick={onSwitchAccept}>
        <CheckBox onChange={onSwitchAccept} isChecked={checkedDisclaimer} />
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
            ml={1}
            color="palette.primary.main"
            onClick={e => {
              e.preventDefault();
              openURL(tos);
            }}
            iconFirst
            style={{ textTransform: "capitalize", display: "inline-flex" }}
          >
            <Trans i18nKey="swap.modal.steps.summary.terms" />
            <Box ml={1}>
              <IconExternalLink size={12} />
            </Box>
          </FakeLink>
          {"."}
        </Text>
      </Box>
    </Box>
  );
};

export const StepSummaryFooter = ({
  onContinue,
  onClose,
  disabled,
  ratesExpiration,
  setError,
}: {
  onContinue: any,
  onClose: any,
  disabled: boolean,
  ratesExpiration: Date,
  setError: Error => void,
}) => (
  <Box horizontal flex={1} justifyContent={"flex-end"} alignItems={"center"}>
    <CountdownTimerWrapper horizontal>
      <Box mr={1}>
        <IconClock size={14} />
      </Box>
      <CountdownTimer
        key={`rates-${ratesExpiration.getTime()}`}
        end={ratesExpiration}
        callback={() => setError(new SwapGenericAPIError())}
      />
    </CountdownTimerWrapper>
    <Box horizontal flex={1} justifyContent={"flex-end"}>
      <Button onClick={onClose} secondary data-e2e="modal_buttonClose_swap">
        <Trans i18nKey="common.close" />
      </Button>
      <Button
        ml={1}
        onClick={onContinue}
        disabled={disabled}
        primary
        data-e2e="modal_buttonContinue_swap"
      >
        <Trans i18nKey="common.confirm" />
      </Button>
    </Box>
  </Box>
);

export default StepSummary;

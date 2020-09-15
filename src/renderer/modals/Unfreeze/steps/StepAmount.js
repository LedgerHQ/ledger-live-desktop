// @flow
import invariant from "invariant";
import React, { useCallback, useMemo } from "react";
import styled from "styled-components";

import { Trans } from "react-i18next";
import moment from "moment";

import type { StepProps } from "../types";

import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";

import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import InfoCircle from "~/renderer/icons/InfoCircle";
import Text from "~/renderer/components/Text";
import FormattedVal from "~/renderer/components/FormattedVal";
import CheckBox from "~/renderer/components/CheckBox";
import Clock from "~/renderer/icons/Clock";

import ErrorBanner from "~/renderer/components/ErrorBanner";

import { getUnfreezeData } from "../Body";

const Description = styled(Text).attrs(({ isPill }) => ({
  ff: isPill ? "Inter|SemiBold" : "Inter|Regular",
  fontSize: isPill ? 2 : 3,
  color: "palette.text.shade60",
}))`
  ${p =>
    p.isPill
      ? `
    text-transform: uppercase;
  `
      : ""}
`;

const SelectResource = styled(Box).attrs(() => ({
  horizontal: true,
  p: 3,
  mt: 2,
  alignItems: "center",
  justifyContent: "space-between",
}))`
  height: 58px;
  border: 1px solid ${p => p.theme.colors.palette.text.shade20};
  border-radius: 4px;
  ${p =>
    p.disabled
      ? `
          opacity: 0.7;
          cursor: auto;
        `
      : ``}
`;

const TimerWrapper = styled(Box).attrs(() => ({
  horizontal: true,
  alignItems: "center",
  ff: "Inter|Medium",
  fontSize: 3,
  color: "palette.text.shade60",
  bg: "palette.text.shade10",
  borderRadius: 4,
  p: 1,
  mr: 4,
}))`
  align-self: center;

  ${Description} {
    margin-left: 5px;
  }
`;

export default function StepAmount({
  account,
  parentAccount,
  onChangeTransaction,
  transaction,
  status,
  error,
  bridgePending,
  t,
}: StepProps) {
  invariant(
    account && transaction && account.tronResources && account.tronResources.frozen,
    "account with frozen assets and transaction required",
  );

  const bridge = getAccountBridge(account, parentAccount);

  const onChange = useCallback(
    (resource: string) =>
      onChangeTransaction(
        bridge.updateTransaction(transaction, {
          resource,
        }),
      ),
    [bridge, transaction, onChangeTransaction],
  );

  const selectBandwidth = useCallback(() => onChange("BANDWIDTH"), [onChange]);

  const selectEnergy = useCallback(() => onChange("ENERGY"), [onChange]);

  const {
    unfreezeBandwidth,
    unfreezeEnergy,
    canUnfreezeBandwidth,
    canUnfreezeEnergy,
    bandwidthExpiredAt,
    energyExpiredAt,
  } = useMemo(() => getUnfreezeData(account), [account]);

  const formattedBandwidthDate = useMemo(() => moment(bandwidthExpiredAt).fromNow(), [
    bandwidthExpiredAt,
  ]);

  const formattedEnergyDate = useMemo(() => moment(energyExpiredAt).fromNow(), [energyExpiredAt]);

  const { resource } = transaction;

  return (
    <Box flow={1}>
      <TrackPage category="Unfreeze Flow" name="Step 1" />
      {error ? <ErrorBanner error={error} /> : null}
      <Box vertical>
        <SelectResource disabled={!canUnfreezeBandwidth}>
          <Text ff="Inter|SemiBold" fontSize={4}>
            <Trans i18nKey="account.bandwidth" />
          </Text>
          <Box horizontal alignItems="center">
            {unfreezeBandwidth.gt(0) && !canUnfreezeBandwidth ? (
              <TimerWrapper>
                <Clock size={12} />
                <Description isPill>{formattedBandwidthDate}</Description>
              </TimerWrapper>
            ) : null}
            <FormattedVal
              val={unfreezeBandwidth}
              unit={account.unit}
              style={{ textAlign: "right", width: "auto", marginRight: 10 }}
              showCode
              fontSize={4}
              color="palette.text.shade60"
            />
            <CheckBox
              isRadio
              disabled={!canUnfreezeBandwidth}
              isChecked={transaction.resource === "BANDWIDTH"}
              onChange={selectBandwidth}
            />
          </Box>
        </SelectResource>
        <SelectResource disabled={!canUnfreezeEnergy}>
          <Text ff="Inter|SemiBold" fontSize={4}>
            <Trans i18nKey="account.energy" />
          </Text>
          <Box horizontal alignItems="center">
            {unfreezeEnergy.gt(0) && !canUnfreezeEnergy ? (
              <TimerWrapper>
                <Clock size={12} />
                <Description isPill>{formattedEnergyDate}</Description>
              </TimerWrapper>
            ) : null}
            <FormattedVal
              val={unfreezeEnergy}
              unit={account.unit}
              style={{ textAlign: "right", width: "auto", marginRight: 10 }}
              showCode
              fontSize={4}
              color="palette.text.shade60"
            />
            <CheckBox
              isRadio
              disabled={!canUnfreezeEnergy}
              isChecked={transaction.resource === "ENERGY"}
              onChange={selectEnergy}
            />
          </Box>
        </SelectResource>
      </Box>
      {resource && (
        <Box
          flex="1"
          my={4}
          borderRadius={4}
          horizontal
          alignItems="center"
          p={2}
          bg="palette.divider"
        >
          <Box mr={2}>
            <InfoCircle size={12} />
          </Box>
          <Text ff="Inter|SemiBold" textAlign="center" fontSize={3}>
            <Trans
              i18nKey="unfreeze.steps.amount.info"
              values={{ resource: resource.toLowerCase() }}
            />
          </Text>
        </Box>
      )}
    </Box>
  );
}

export function StepAmountFooter({
  transitionTo,
  account,
  parentAccount,
  onClose,
  status,
  bridgePending,
  transaction,
}: StepProps) {
  invariant(account, "account required");
  const { errors } = status;
  const hasErrors = Object.keys(errors).length;
  const canNext = !bridgePending && !hasErrors;

  return (
    <Box horizontal>
      <Button mr={1} secondary onClick={onClose}>
        <Trans i18nKey="common.cancel" />
      </Button>
      <Button disabled={!canNext} primary onClick={() => transitionTo("connectDevice")}>
        <Trans i18nKey="common.continue" />
      </Button>
    </Box>
  );
}

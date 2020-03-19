// @flow
import invariant from "invariant";
import React, { useCallback } from "react";
import styled from "styled-components";
import { BigNumber } from "bignumber.js";
import { Trans } from "react-i18next";

import type { StepProps } from "../types";

import { getAccountBridge } from "@ledgerhq/live-common/lib/bridge";

import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import InfoCircle from "~/renderer/icons/InfoCircle";
import Text from "~/renderer/components/Text";
import FormattedVal from "~/renderer/components/FormattedVal";
import CheckBox from "~/renderer/components/CheckBox";

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
    cursor: auto;
    filter: contrast(0);
    ${CheckBox} {
      background-color: transparent;
      color: transparent;
    }
  `
      : ``}
`;

export default function StepAmount({
  account,
  parentAccount,
  onChangeTransaction,
  transaction,
  status,
  bridgePending,
  t,
}: StepProps) {
  invariant(
    account && transaction && account.tronResources && account.tronResources.frozen,
    "account with frozen assets and transaction required",
  );

  const bridge = getAccountBridge(account, parentAccount);

  const onChange = useCallback(() => {});

  const { tronResources: { frozen: { bandwidth, energy } = {} } = {} } = account;

  const UnfreezeBandwidth = BigNumber((bandwidth && bandwidth.amount) || 0);
  const UnfreezeEnergy = BigNumber((energy && energy.amount) || 0);

  const { resource = "BANDWIDTH" } = transaction;

  return (
    <Box flow={1}>
      <TrackPage category="Unfreeze Flow" name="Step 1" />
      <Box vertical>
        <SelectResource disabled={!UnfreezeBandwidth.gt(0)}>
          <Text ff="Inter|Medium" fontSize={5}>
            <Trans i18nKey="account.bandwidth" />
          </Text>
          <Box horizontal>
            <FormattedVal
              val={UnfreezeBandwidth}
              unit={account.unit}
              style={{ textAlign: "right", width: "auto", marginRight: 10 }}
              showCode
              fontSize={4}
              color="palette.text.shade60"
            />
            <CheckBox isChecked={transaction.resource === "BANDWIDTH"} />
          </Box>
        </SelectResource>
        <SelectResource disabled={!UnfreezeEnergy.gt(0)}>
          <Text ff="Inter|Medium" fontSize={5}>
            <Trans i18nKey="account.energy" />
          </Text>
          <Box horizontal>
            <FormattedVal
              val={UnfreezeEnergy}
              unit={account.unit}
              style={{ textAlign: "right", width: "auto", marginRight: 10 }}
              showCode
              fontSize={4}
              color="palette.text.shade60"
            />
            <CheckBox isChecked={transaction.resource === "ENERGY"} />
          </Box>
        </SelectResource>
      </Box>
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
        <Text ff="Inter|Regular" textAlign="center" fontSize={3}>
          <Trans
            i18nKey="unfreeze.steps.amount.info"
            values={{ resource: resource.toLowerCase() }}
          />
        </Text>
      </Box>
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

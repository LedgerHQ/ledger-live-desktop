// @flow
import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";
import moment from "moment";
import { Polkadot as PolkadotIdenticon } from "@polkadot/react-identicon/icons";

import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import type {
  PolkadotValidator,
  PolkadotNomination,
  PolkadotUnlocking,
} from "@ledgerhq/live-common/lib/families/polkadot/types";
import type { Account } from "@ledgerhq/live-common/lib/types";

import { TableLine } from "./Header";

import { useDiscreetMode } from "~/renderer/components/Discreet";
import Box from "~/renderer/components/Box/Box";
import CheckCircle from "~/renderer/icons/CheckCircle";
import ClockIcon from "~/renderer/icons/Clock";
import ExclamationCircle from "~/renderer/icons/ExclamationCircle";
import ToolTip from "~/renderer/components/Tooltip";
import ExternalLink from "~/renderer/icons/ExternalLink";

const Wrapper: ThemedComponent<*> = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 16px 20px;
`;

const Column: ThemedComponent<*> = styled(TableLine).attrs(p => ({
  ff: "Inter|SemiBold",
  color: "palette.text.shade80",
  fontSize: 3,
}))``;

const IconContainer: ThemedComponent<*> = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: ${p => p.theme.colors.palette.primary.main};
`;

const ValidatorName: ThemedComponent<*> = styled(TableLine).attrs(p => ({
  ff: "Inter|SemiBold",
  color: "palette.text.shade100",
  fontSize: 3,
}))`
  cursor: pointer;
  ${IconContainer} {
    opacity: 0;
  }

  &:hover {
    color: ${p => p.theme.colors.palette.primary.main};
  }

  &:hover > ${IconContainer} {
    opacity: 1;
  }
`;

const Ellipsis: ThemedComponent<{}> = styled.div`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StatusLabel: ThemedComponent<{}> = styled.div`
  flex: 1;
  display: block;
  margin-left: 8px;
`;

type Props = {
  account: Account,
  nomination: PolkadotNomination,
  validator?: PolkadotValidator,
  onExternalLink: (address: string) => void,
};

export function Row({
  account,
  nomination: { value, address, status },
  validator,
  onExternalLink,
}: Props) {
  const discreet = useDiscreetMode();
  const name = validator?.identity || address;
  const total = validator?.totalBonded ?? null;
  const commission = validator?.commission ?? null;
  const unit = getAccountUnit(account);

  const formattedAmount = useMemo(
    () =>
      value && (status === "active" || status === "inactive")
        ? formatCurrencyUnit(unit, value, {
            disableRounding: false,
            alwaysShowSign: false,
            showCode: true,
            discreet: discreet && status === "active",
          })
        : "-",
    [status, unit, value, discreet],
  );

  const formattedTotal = useMemo(
    () =>
      total && total.gt(0)
        ? formatCurrencyUnit(unit, total, {
            disableRounding: false,
            alwaysShowSign: false,
            showCode: true,
            showAllDigits: false,
          })
        : "-",
    [unit, total],
  );

  const formattedCommission = useMemo(
    () => (commission ? `${commission.multipliedBy(100).toFixed(2)} %` : "-"),
    [commission],
  );

  const onExternalLinkClick = useCallback(() => onExternalLink(address), [onExternalLink, address]);

  return (
    <Wrapper>
      <ValidatorName onClick={onExternalLinkClick}>
        <Box mr={2}>
          <PolkadotIdenticon address={address} size={24} />
        </Box>
        <ToolTip content={validator?.identity ? address : null}>
          <Ellipsis>{name}</Ellipsis>
        </ToolTip>
        <IconContainer>
          <ExternalLink size={16} />
        </IconContainer>
      </ValidatorName>
      <Column>
        {status === "active" && (
          <Box color="positiveGreen" pl={2}>
            <ToolTip content={<Trans i18nKey="polkadot.nomination.activeTooltip" />}>
              <CheckCircle size={14} />
              <StatusLabel>
                <Trans i18nKey="polkadot.nomination.active" />
              </StatusLabel>
            </ToolTip>
          </Box>
        )}
        {status === "inactive" && (
          <Box color="grey" pl={2}>
            <ToolTip content={<Trans i18nKey="polkadot.nomination.inactiveTooltip" />}>
              <ClockIcon size={14} />
              <StatusLabel>
                <Trans i18nKey="polkadot.nomination.inactive" />
              </StatusLabel>
            </ToolTip>
          </Box>
        )}
        {status === "waiting" && (
          <Box color="grey" pl={2}>
            <ToolTip content={<Trans i18nKey="polkadot.nomination.waitingTooltip" />}>
              <ClockIcon size={14} />
              <StatusLabel>
                <Trans i18nKey="polkadot.nomination.waiting" />
              </StatusLabel>
            </ToolTip>
          </Box>
        )}
        {!status && (
          <Box color="warning" pl={2}>
            <ToolTip content={<Trans i18nKey="polkadot.nomination.notValidatorTooltip" />}>
              <ExclamationCircle size={14} />
              <StatusLabel>
                <Trans i18nKey="polkadot.nomination.notValidator" />
              </StatusLabel>
            </ToolTip>
          </Box>
        )}
      </Column>
      <Column>{formattedCommission}</Column>
      <Column>{formattedTotal}</Column>
      <Column>{formattedAmount}</Column>
    </Wrapper>
  );
}

type UnlockingRowProps = {
  account: Account,
  unlocking: PolkadotUnlocking,
};

export function UnlockingRow({
  account,
  unlocking: { amount, completionDate },
}: UnlockingRowProps) {
  const date = useMemo(() => (completionDate ? moment(completionDate).fromNow() : "N/A"), [
    completionDate,
  ]);
  const isUnbonded = useMemo(() => moment(completionDate).isBefore(moment()), [completionDate]);

  const unit = getAccountUnit(account);

  const formattedAmount = useMemo(
    () =>
      formatCurrencyUnit(unit, amount, {
        disableRounding: true,
        alwaysShowSign: false,
        showCode: true,
      }),
    [unit, amount],
  );

  return (
    <Wrapper>
      <Column>{formattedAmount}</Column>
      <Column>
        {isUnbonded ? (
          <Box color="positiveGreen" pl={2} horizontal={true}>
            <CheckCircle size={14} />
            <StatusLabel>
              <Trans i18nKey="polkadot.unlockings.unbonded" />
            </StatusLabel>
          </Box>
        ) : (
          date
        )}
      </Column>
    </Wrapper>
  );
}

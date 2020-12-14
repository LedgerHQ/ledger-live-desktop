// @flow

import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";
import moment from "moment";
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
// import DropDown, { DropDownItem } from "~/renderer/components/DropDownSelector";

import Box from "~/renderer/components/Box/Box";
// import ChevronRight from "~/renderer/icons/ChevronRight";
import CheckCircle from "~/renderer/icons/CheckCircle";
import InfoCircle from "~/renderer/icons/InfoCircle";
import ToolTip from "~/renderer/components/Tooltip";
import FirstLetterIcon from "~/renderer/components/FirstLetterIcon";
// import Text from "~/renderer/components/Text";

const Wrapper: ThemedComponent<*> = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 16px 20px;
`;

const Column: ThemedComponent<{ clickable?: boolean }> = styled(TableLine).attrs(p => ({
  ff: "Inter|SemiBold",
  color: p.strong ? "palette.text.shade100" : "palette.text.shade80",
  fontSize: 3,
}))`
  cursor: ${p => (p.clickable ? "pointer" : "cursor")};
  ${p =>
    p.clickable
      ? `
    &:hover {
      color: ${p.theme.colors.palette.primary.main};
    }
    `
      : ``}
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
  margin-right: 8px;
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
  const name = validator?.identity || address;
  const total = validator?.totalBonded ?? null;
  const commission = validator?.commission ?? null;
  const unit = getAccountUnit(account);

  const formattedAmount = useMemo(
    () =>
      value && (status === "active" || status === "inactive")
        ? formatCurrencyUnit(unit, value, {
            disableRounding: true,
            alwaysShowSign: false,
            showCode: true,
          })
        : "-",
    [status, unit, value],
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
      <Column strong clickable onClick={onExternalLinkClick}>
        <Box mr={2}>
          <FirstLetterIcon label={name} />
        </Box>
        <Ellipsis>{name}</Ellipsis>
      </Column>
      <Column>
        {status === "active" && (
          <Box color="positiveGreen" pl={2}>
            <ToolTip content={<Trans i18nKey="polkadot.nomination.activeTooltip" />}>
              <StatusLabel>
                <Trans i18nKey="polkadot.nomination.active" />
              </StatusLabel>
              <CheckCircle size={14} />
            </ToolTip>
          </Box>
        )}
        {status === "inactive" && (
          <Box color="grey" pl={2}>
            <ToolTip content={<Trans i18nKey="polkadot.nomination.inactiveTooltip" />}>
              <StatusLabel>
                <Trans i18nKey="polkadot.nomination.inactive" />
              </StatusLabel>
              <InfoCircle size={14} />
            </ToolTip>
          </Box>
        )}
        {status === "waiting" && (
          <Box color="grey" pl={2}>
            <ToolTip content={<Trans i18nKey="polkadot.nomination.waitingTooltip" />}>
              <StatusLabel>
                <Trans i18nKey="polkadot.nomination.waiting" />
              </StatusLabel>
              <InfoCircle size={14} />
            </ToolTip>
          </Box>
        )}
        {!status && (
          <Box color="warning" pl={2}>
            <ToolTip content={<Trans i18nKey="polkadot.nomination.notValidatorTooltip" />}>
              <StatusLabel>
                <Trans i18nKey="polkadot.nomination.notValidator" />
              </StatusLabel>
              <InfoCircle size={14} />
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

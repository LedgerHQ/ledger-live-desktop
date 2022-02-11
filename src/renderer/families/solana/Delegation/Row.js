// @flow

import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";
import moment from "moment";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import type { SolanaStakeWithMeta } from "@ledgerhq/live-common/lib/families/solana/types";
import { stakeActions as solanaStakeActions } from "@ledgerhq/live-common/lib/families/solana/logic";
import type { Account } from "@ledgerhq/live-common/lib/types";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";

import { TableLine } from "./Header";
import DropDown, { DropDownItem } from "~/renderer/components/DropDownSelector";

import Box from "~/renderer/components/Box/Box";
import ChevronRight from "~/renderer/icons/ChevronRight";
import CheckCircle from "~/renderer/icons/CheckCircle";
import ExclamationCircleThin from "~/renderer/icons/ExclamationCircleThin";
import ToolTip from "~/renderer/components/Tooltip";
import FirstLetterIcon from "~/renderer/components/FirstLetterIcon";
import Text from "~/renderer/components/Text";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import { BigNumber } from "bignumber.js";

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
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Divider: ThemedComponent<*> = styled.div`
  width: 100%;
  height: 1px;
  margin-bottom: ${p => p.theme.space[1]}px;
  background-color: ${p => p.theme.colors.palette.divider};
`;

const ManageDropDownItem = ({
  item,
  isActive,
}: {
  item: { key: string, label: string, disabled: boolean, tooltip: React$Node },
  isActive: boolean,
}) => {
  return (
    <>
      {item.key === "MODAL_COSMOS_CLAIM_REWARDS" && <Divider />}
      <ToolTip content={item.tooltip} containerStyle={{ width: "100%" }}>
        <DropDownItem disabled={item.disabled} isActive={isActive}>
          <Box horizontal alignItems="center" justifyContent="center">
            <Text ff="Inter|SemiBold">{item.label}</Text>
          </Box>
        </DropDownItem>
      </ToolTip>
    </>
  );
};

type Props = {
  account: Account,
  stakeWithMeta: SolanaStakeWithMeta,
  onManageAction: (stakeWithMeta: SolanaStakeWithMeta, action: "MODAL_SOLANA_UNSTAKE") => void,
  onExternalLink: (address: string) => void,
};

export function Row({ account, stakeWithMeta, onManageAction, onExternalLink }: Props) {
  const onSelect = useCallback(
    action => {
      onManageAction(stakeWithMeta, action.key);
    },
    [onManageAction],
  );

  //const _canUndelegate = canUndelegate(account);
  //const _canRedelegate = canRedelegate(account, delegation);
  //const _canUndelegate = false;
  //const _canRedelegate = false;

  //const redelegationDate = !_canRedelegate && getRedelegationCompletionDate(account, delegation);
  //const formattedRedelegationDate = redelegationDate ? moment(redelegationDate).fromNow() : "";
  //

  const { stake, meta } = stakeWithMeta;

  const stakeActions = solanaStakeActions(stake).map(toStakeDropDownItem);

  /*
  const dropDownItems = useMemo(
    () => [
      {
        key: "MODAL_COSMOS_REDELEGATE",
        label: <Trans i18nKey="cosmos.delegation.redelegate" />,
        disabled: !_canRedelegate,
        tooltip: !_canRedelegate ? (
          formattedRedelegationDate ? (
            <Trans
              i18nKey="cosmos.delegation.redelegateDisabledTooltip"
              values={{ days: formattedRedelegationDate }}
            >
              <b></b>
            </Trans>
          ) : (
            <Trans i18nKey="cosmos.delegation.redelegateMaxDisabledTooltip">
              <b></b>
            </Trans>
          )
        ) : null,
      },
      {
        key: "MODAL_COSMOS_UNDELEGATE",
        label: <Trans i18nKey="cosmos.delegation.undelegate" />,
        disabled: !_canUndelegate,
        tooltip: !_canUndelegate ? (
          <Trans i18nKey="cosmos.delegation.undelegateDisabledTooltip">
            <b></b>
          </Trans>
        ) : null,
      },
      ...(pendingRewards.gt(0)
        ? [
            {
              key: "MODAL_COSMOS_CLAIM_REWARDS",
              label: <Trans i18nKey="cosmos.delegation.reward" />,
            },
          ]
        : []),
    ],
    [pendingRewards, _canRedelegate, _canUndelegate, formattedRedelegationDate],
  );
  */
  //const name = validator?.name ?? validatorAddress;
  const isDelegated = stake.delegation !== undefined;

  const validatorName = isDelegated
    ? meta.validator?.name ?? stake.delegation.voteAccAddr
    : "Not Delegated";

  /*
  const onExternalLinkClick = useCallback(() => onExternalLink(validatorAddress), [
    onExternalLink,
    validatorAddress,
  ]);
  */

  const formatAmount = (amount: number) => {
    const unit = getAccountUnit(account);
    return formatCurrencyUnit(unit, new BigNumber(amount), {
      disableRounding: true,
      alwaysShowSign: false,
      showCode: true,
    });
  };

  return (
    <Wrapper>
      <Column strong clickable onClick={null}>
        <Box mr={2}>
          <FirstLetterIcon label={stake.delegation?.voteAddr ?? "-"} />
        </Box>
        <Ellipsis>{validatorName}</Ellipsis>
      </Column>
      <Column>
        {stake.activation.state === "active" || stake.activation.state === "activating" ? (
          <Box color="positiveGreen" pl={2}>
            <ToolTip content={<Trans i18nKey="cosmos.delegation.activeTooltip" />}>
              <CheckCircle size={14} />
            </ToolTip>
          </Box>
        ) : (
          <Box color="alertRed" pl={2}>
            <ToolTip content={<Trans i18nKey="cosmos.delegation.inactiveTooltip" />}>
              <ExclamationCircleThin size={14} />
            </ToolTip>
          </Box>
        )}
        <div>{stake.activation.state}</div>
      </Column>
      <Column>{formatAmount(stake.stakeAccBalance)}</Column>
      <Column>
        {formatAmount(stake.activation.state === "inactive" ? 0 : stake.delegation?.stake ?? 0)}
      </Column>
      <Column>{(stake.activation.active / stake.delegation?.stake) * 100} %</Column>
      <Column>{formatAmount(stake.withdrawable)}</Column>
      <Column>
        <DropDown items={stakeActions} renderItem={ManageDropDownItem} onChange={onSelect}>
          {({ isOpen, value }) => (
            <Box flex horizontal alignItems="center">
              <Trans i18nKey="common.manage" />
              <div style={{ transform: "rotate(90deg)" }}>
                <ChevronRight size={16} />
              </div>
            </Box>
          )}
        </DropDown>
      </Column>
    </Wrapper>
  );
}

function toStakeDropDownItem(stakeAction: string) {
  switch (stakeAction) {
    case "activate":
      return {
        key: "MODAL_SOLANA_DELEGATE",
        label: <Trans i18nKey="solana.delegation.activate" />,
      };
    case "reactivate":
      return {
        key: "MODAL_SOLANA_DELEGATION_REACTIVATE",
        label: <Trans i18nKey="solana.delegation.reactivate" />,
      };
    case "deactivate":
      return {
        key: "MODAL_SOLANA_UNDELEGATE",
        label: <Trans i18nKey="solana.delegation.undelegate" />,
      };
    case "withdraw":
      return {
        key: "MODAL_SOLANA_DELEGATION_WITHDRAW",
        label: <Trans i18nKey="solana.delegation.withdraw" />,
      };
    default:
      throw new Error(`unsupported stake action: ${stakeAction}`);
  }
}

/*
type UnbondingRowProps = {
  delegation: CosmosMappedUnbonding,
  onExternalLink: (address: string) => void,
};

export function UnbondingRow({
  delegation: { validator, formattedAmount, validatorAddress, completionDate },
  onExternalLink,
}: UnbondingRowProps) {
  const date = useMemo(() => (completionDate ? moment(completionDate).fromNow() : "N/A"), [
    completionDate,
  ]);
  const name = validator?.name ?? validatorAddress;

  const onExternalLinkClick = useCallback(() => onExternalLink(validatorAddress), [
    onExternalLink,
    validatorAddress,
  ]);
  return (
    <Wrapper>
      <Column strong clickable onClick={onExternalLinkClick}>
        <Box mr={2}>
          <FirstLetterIcon label={name} />
        </Box>
        <Ellipsis>{name}</Ellipsis>
      </Column>
      <Column>
        <Box color="alertRed" pl={2}>
          <ToolTip content={<Trans i18nKey="cosmos.undelegation.inactiveTooltip" />}>
            <ExclamationCircleThin size={14} />
          </ToolTip>
        </Box>
      </Column>
      <Column>{formattedAmount}</Column>
      <Column>{date}</Column>
    </Wrapper>
  );
}
*/

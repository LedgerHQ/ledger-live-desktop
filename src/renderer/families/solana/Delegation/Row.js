// @flow

import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";
import {
  stakeActions as solanaStakeActions,
  stakeActivePercent,
} from "@ledgerhq/live-common/lib/families/solana/logic";
import type { SolanaStakeWithMeta } from "@ledgerhq/live-common/lib/families/solana/types";
import type { Account } from "@ledgerhq/live-common/lib/types";
import { BigNumber } from "bignumber.js";
import React, { useCallback } from "react";
import { Trans } from "react-i18next";
import styled from "styled-components";
import Box from "~/renderer/components/Box/Box";
import DropDown, { DropDownItem } from "~/renderer/components/DropDownSelector";
import FirstLetterIcon from "~/renderer/components/FirstLetterIcon";
import Image from "~/renderer/components/Image";
import Text from "~/renderer/components/Text";
import ToolTip from "~/renderer/components/Tooltip";
import CheckCircle from "~/renderer/icons/CheckCircle";
import ChevronRight from "~/renderer/icons/ChevronRight";
import ExclamationCircleThin from "~/renderer/icons/ExclamationCircleThin";
import Loader from "~/renderer/icons/Loader";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { TableLine } from "./Header";

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

const ManageDropDownItem = ({
  item,
  isActive,
}: {
  item: { key: string, label: string, disabled: boolean, tooltip: React$Node },
  isActive: boolean,
}) => {
  return (
    <>
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
  onManageAction: (stakeWithMeta: SolanaStakeWithMeta, action: string) => void,
  onExternalLink: (address: string) => void,
};

export function Row({ account, stakeWithMeta, onManageAction, onExternalLink }: Props) {
  const onSelect = useCallback(
    action => {
      onManageAction(stakeWithMeta, action.key);
    },
    [onManageAction],
  );

  const { stake, meta } = stakeWithMeta;

  const stakeActions = solanaStakeActions(stake).map(toStakeDropDownItem);

  const validatorName = meta.validator?.name ?? stake.delegation?.voteAccAddr ?? "-";

  const onExternalLinkClick = () => onExternalLink(stakeWithMeta);

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
      <Column strong clickable onClick={onExternalLinkClick}>
        <Box mr={1}>
          {meta.validator?.img !== undefined && (
            <Image resource={meta.validator.img} height={32} width={32} alt="" />
          )}
          {meta.validator?.img === undefined && <FirstLetterIcon label={validatorName ?? "-"} />}
        </Box>
        <Ellipsis>{validatorName}</Ellipsis>
      </Column>
      <Column>
        {stake.activation.state === "active" && (
          <Box color="positiveGreen">
            <ToolTip content={<Trans i18nKey="solana.delegation.activeTooltip" />}>
              <CheckCircle size={14} />
            </ToolTip>
          </Box>
        )}
        {stake.activation.state === "inactive" && (
          <Box color="alertRed">
            <ToolTip content={<Trans i18nKey="solana.delegation.inactiveTooltip" />}>
              <ExclamationCircleThin size={14} />
            </ToolTip>
          </Box>
        )}
        {(stake.activation.state === "activating" || stake.activation.state === "deactivating") && (
          <Box color="orange">
            <ToolTip content={<Trans i18nKey="solana.delegation.inactiveTooltip" />}>
              <Loader size={14} />
            </ToolTip>
          </Box>
        )}
        <Box ml={1}>{stake.activation.state}</Box>
      </Column>
      <Column>{formatAmount(stake.delegation?.stake ?? 0)}</Column>
      <Column>{stake.delegation === undefined ? 0 : stakeActivePercent(stake).toFixed(2)} %</Column>
      <Column>{formatAmount(stake.withdrawable)}</Column>
      <Column>
        <DropDown items={stakeActions} renderItem={ManageDropDownItem} onChange={onSelect}>
          {({ isOpen, value }) => {
            return (
              <Box flex horizontal alignItems="center">
                <Trans i18nKey="common.manage" />
                <div style={{ transform: "rotate(90deg)" }}>
                  <ChevronRight size={16} />
                </div>
              </Box>
            );
          }}
        </DropDown>
      </Column>
    </Wrapper>
  );
}

function toStakeDropDownItem(stakeAction: string) {
  switch (stakeAction) {
    case "activate":
      return {
        key: "MODAL_SOLANA_DELEGATION_ACTIVATE",
        label: <Trans i18nKey="solana.delegation.activate.flow.title" />,
      };
    case "reactivate":
      return {
        key: "MODAL_SOLANA_DELEGATION_REACTIVATE",
        label: <Trans i18nKey="solana.delegation.reactivate.flow.title" />,
      };
    case "deactivate":
      return {
        key: "MODAL_SOLANA_DELEGATION_DEACTIVATE",
        label: <Trans i18nKey="solana.delegation.deactivate.flow.title" />,
      };
    case "withdraw":
      return {
        key: "MODAL_SOLANA_DELEGATION_WITHDRAW",
        label: <Trans i18nKey="solana.delegation.withdraw.flow.title" />,
      };
    default:
      throw new Error(`unsupported stake action: ${stakeAction}`);
  }
}

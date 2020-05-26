// @flow

import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";
import moment from "moment";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import type {
  CosmosMappedDelegation,
  CosmosMappedUnbonding,
} from "@ledgerhq/live-common/lib/families/cosmos/types";

import Ellipsis from "~/renderer/components/Ellipsis";

import { TableLine } from "./Header";
import DropDown, { DropDownItem } from "~/renderer/components/DropDownSelector";

import Box from "~/renderer/components/Box/Box";
import ChevronRight from "~/renderer/icons/ChevronRight";
import CheckCircle from "~/renderer/icons/CheckCircle";
import ExclamationCircleThin from "~/renderer/icons/ExclamationCircleThin";
import ToolTip from "~/renderer/components/Tooltip";
import FirstLetterIcon from "~/renderer/components/FirstLetterIcon";

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
  item: { key: string, label: string },
  isActive: boolean,
}) => {
  return (
    <>
      {item.key === "MODAL_COSMOS_CLAIM_REWARDS" && <Divider />}
      <DropDownItem isActive={isActive}>
        <Box horizontal alignItems="center" justifyContent="center">
          {item.label}
        </Box>
      </DropDownItem>
    </>
  );
};

type Props = {
  delegation: CosmosMappedDelegation,
  onManageAction: (
    address: string,
    action: "MODAL_COSMOS_REDELEGATE" | "MODAL_COSMOS_UNDELEGATE" | "MODAL_COSMOS_CLAIM_REWARDS",
  ) => void,
};

export function Row({
  delegation: {
    amount,
    validatorAddress,
    formattedAmount,
    pendingRewards,
    formattedPendingRewards,
    validator,
  },
  onManageAction,
}: Props) {
  const onSelect = useCallback(
    action => {
      onManageAction(validatorAddress, action.key);
    },
    [onManageAction, validatorAddress],
  );

  const dropDownItems = useMemo(
    () => [
      {
        key: "MODAL_COSMOS_REDELEGATE",
        label: <Trans i18nKey="cosmos.delegation.redelegate" />,
      },
      {
        key: "MODAL_COSMOS_UNDELEGATE",
        label: <Trans i18nKey="cosmos.delegation.undelegate" />,
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
    [pendingRewards],
  );
  const name = validator?.name ?? validatorAddress;

  return (
    <Wrapper>
      <Column strong>
        <Box mr={2}>
          <FirstLetterIcon label={name} />
        </Box>
        <Ellipsis>{name}</Ellipsis>
      </Column>
      <Column>
        {status === "bonded" ? (
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
      </Column>
      <Column>{formattedAmount}</Column>
      <Column>{formattedPendingRewards}</Column>
      <Column>
        <DropDown items={dropDownItems} renderItem={ManageDropDownItem} onChange={onSelect}>
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

type UnbondingRowProps = {
  delegation: CosmosMappedUnbonding,
};

export function UnbondingRow({
  delegation: { validator, formattedAmount, validatorAddress, completionDate },
}: UnbondingRowProps) {
  const date = useMemo(() => (completionDate ? moment(completionDate).fromNow() : "N/A"), [
    completionDate,
  ]);
  const name = validator?.name ?? validatorAddress;
  return (
    <Wrapper>
      <Column strong>
        <Box mr={2}>
          <FirstLetterIcon label={name} />
        </Box>
        <Ellipsis>{name}</Ellipsis>
      </Column>
      <Column>
        <Box color="alertRed" pl={2}>
          <ToolTip content={<Trans i18nKey="cosmos.delegation.inactiveTooltip" />}>
            <ExclamationCircleThin size={14} />
          </ToolTip>
        </Box>
      </Column>
      <Column>{formattedAmount}</Column>
      <Column>{date}</Column>
    </Wrapper>
  );
}

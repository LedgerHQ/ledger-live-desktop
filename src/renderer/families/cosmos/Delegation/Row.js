// @flow

import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import { Trans } from "react-i18next";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import type { BigNumber } from "bignumber.js";
import type { Unit } from "@ledgerhq/live-common/lib/types";
import type {
  CosmosValidatorItem,
  CosmosDelegationStatus,
} from "@ledgerhq/live-common/lib/families/cosmos/types";

import FormattedVal from "~/renderer/components/FormattedVal";
import Ellipsis from "~/renderer/components/Ellipsis";

import { TableLine } from "./Header";
import DropDown, { DropDownItem } from "~/renderer/components/DropDownSelector";

import Box from "~/renderer/components/Box/Box";
import ChevronRight from "~/renderer/icons/ChevronRight";

import IconDelegate from "~/renderer/icons/Delegate";
import IconUndelegate from "~/renderer/icons/Undelegate";
import IconRedelegate from "~/renderer/icons/Redelegate";
import ClaimRewards from "~/renderer/icons/ClaimReward";
import CheckCircle from "~/renderer/icons/CheckCircle";
import ExclamationCircleThin from "~/renderer/icons/ExclamationCircleThin";
import { openModal } from "~/renderer/actions/modals";

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

const dropDownItems = [
  {
    key: "REDELEGATE",
    label: <Trans i18nKey="cosmos.delegation.redelegate" />,
  },
  {
    key: "MODAL_COSMOS_UNDELEGATE",
    label: <Trans i18nKey="cosmos.delegation.undelegate" />,
  },
  {
    key: "MODAL_COSMOS_CLAIM_REWARDS",
    label: <Trans i18nKey="cosmos.delegation.reward" />,
  },
];

const iconsComponent = {
  MODAL_COSMOS_REDELEGATE: IconRedelegate,
  MODAL_COSMOS_UNDELEGATE: IconUndelegate,
  MODAL_COSMOS_CLAIM_REWARDS: ClaimRewards,
};

const ManageDropDownItem = ({
  item,
  isActive,
}: {
  item: { key: string, label: string },
  isActive: boolean,
}) => {
  const Icon = iconsComponent[item.key];
  return (
    <>
      {item.key === "CLAIM_REWARDS" && <Divider />}
      <DropDownItem isActive={isActive}>
        <Box horizontal alignItems="center">
          <Box pr={2}>{Icon && <Icon size={12} />}</Box>

          {item.label}
        </Box>
      </DropDownItem>
    </>
  );
};

type Props = {
  validator: ?CosmosValidatorItem,
  address: string,
  amount: BigNumber,
  pendingRewards: BigNumber,
  unit: Unit,
  status: CosmosDelegationStatus,
  onManageAction: (
    address: string,
    action: "MODAL_COSMOS_REDELEGATE" | "MODAL_COSMOS_UNDELEGATE" | "MODAL_COSMOS_CLAIM_REWARDS",
  ) => void,
};

export default function Row({
  validator,
  address,
  amount,
  pendingRewards,
  unit,
  status,
  onManageAction,
}: Props) {
  const onSelect = useCallback(
    action => {
      onManageAction(address, action.key);
    },
    [onManageAction, address],
  );

  return (
    <Wrapper>
      <Column strong>
        <Ellipsis>{validator ? validator.name : address}</Ellipsis>
      </Column>
      <Column>
        {status === "bonded" ? (
          <Box color="positiveGreen" pl={2}>
            <CheckCircle size={14} />
          </Box>
        ) : (
          <Box color="alertRed" pl={2}>
            <ExclamationCircleThin size={14} />
          </Box>
        )}
      </Column>
      <Column>
        <FormattedVal color="palette.text.shade80" val={amount} unit={unit} showCode />
      </Column>
      <Column>
        <FormattedVal color="palette.text.shade80" val={pendingRewards} unit={unit} showCode />
      </Column>
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

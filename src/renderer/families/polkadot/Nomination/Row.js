// @flow

import React, { useCallback, useMemo } from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";
// import moment from "moment";
import { getAccountUnit } from "@ledgerhq/live-common/lib/account";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import type {
  PolkadotValidator,
  PolkadotNomination,
} from "@ledgerhq/live-common/lib/families/polkadot/types";
import type { Account } from "@ledgerhq/live-common/lib/types";

import { TableLine } from "./Header";
// import DropDown, { DropDownItem } from "~/renderer/components/DropDownSelector";

import Box from "~/renderer/components/Box/Box";
// import ChevronRight from "~/renderer/icons/ChevronRight";
import CheckCircle from "~/renderer/icons/CheckCircle";
import ExclamationCircleThin from "~/renderer/icons/ExclamationCircleThin";
import Clock from "~/renderer/icons/Clock";
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
  margin-left: 8px;
`;

// const Divider: ThemedComponent<*> = styled.div`
//   width: 100%;
//   height: 1px;
//   margin-bottom: ${p => p.theme.space[1]}px;
//   background-color: ${p => p.theme.colors.palette.divider};
// `;

// const ManageDropDownItem = ({
//   item,
//   isActive,
// }: {
//   item: { key: string, label: string, disabled: boolean, tooltip: React$Node },
//   isActive: boolean,
// }) => {
//   return (
//     <>
//       {item.key === "MODAL_COSMOS_CLAIM_REWARDS" && <Divider />}
//       <ToolTip content={item.tooltip} containerStyle={{ width: "100%" }}>
//         <DropDownItem disabled={item.disabled} isActive={isActive}>
//           <Box horizontal alignItems="center" justifyContent="center">
//             <Text ff="Inter|SemiBold">{item.label}</Text>
//           </Box>
//         </DropDownItem>
//       </ToolTip>
//     </>
//   );
// };

type Props = {
  account: Account,
  nomination: PolkadotNomination,
  validator?: PolkadotValidator,
  // onManageAction: (
  //   address: string,
  //   action: "MODAL_COSMOS_REDELEGATE" | "MODAL_COSMOS_UNDELEGATE" | "MODAL_COSMOS_CLAIM_REWARDS",
  // ) => void,
  onExternalLink: (address: string) => void,
};

export function Row({
  account,
  nomination: { value, address, status },
  validator,
  // onManageAction,
  onExternalLink,
}: Props) {
  // const onSelect = useCallback(
  //   action => {
  //     onManageAction(validatorAddress, action.key);
  //   },
  //   [onManageAction, validatorAddress],
  // );

  // const _canUndelegate = canUndelegate(account);
  // const _canRedelegate = canRedelegate(account, delegation);

  // const redelegationDate = !_canRedelegate && getRedelegationCompletionDate(account, delegation);
  // const formattedRedelegationDate = redelegationDate ? moment(redelegationDate).fromNow() : "";

  // const dropDownItems = useMemo(
  //   () => [
  //     {
  //       key: "MODAL_COSMOS_REDELEGATE",
  //       label: <Trans i18nKey="cosmos.delegation.redelegate" />,
  //       disabled: !_canRedelegate,
  //       tooltip: !_canRedelegate ? (
  //         formattedRedelegationDate ? (
  //           <Trans
  //             i18nKey="cosmos.delegation.redelegateDisabledTooltip"
  //             values={{ days: formattedRedelegationDate }}
  //           >
  //             <b></b>
  //           </Trans>
  //         ) : (
  //           <Trans i18nKey="cosmos.delegation.redelegateMaxDisabledTooltip">
  //             <b></b>
  //           </Trans>
  //         )
  //       ) : null,
  //     },
  //     {
  //       key: "MODAL_COSMOS_UNDELEGATE",
  //       label: <Trans i18nKey="cosmos.delegation.undelegate" />,
  //       disabled: !_canUndelegate,
  //       tooltip: !_canUndelegate ? (
  //         <Trans i18nKey="cosmos.delegation.undelegateDisabledTooltip">
  //           <b></b>
  //         </Trans>
  //       ) : null,
  //     },
  //     ...(pendingRewards.gt(0)
  //       ? [
  //           {
  //             key: "MODAL_COSMOS_CLAIM_REWARDS",
  //             label: <Trans i18nKey="cosmos.delegation.reward" />,
  //           },
  //         ]
  //       : []),
  //   ],
  //   [pendingRewards, _canRedelegate, _canUndelegate, formattedRedelegationDate],
  // );

  const name = validator?.identity ?? address;
  const total = validator?.totalBonded ?? null;
  const unit = getAccountUnit(account);

  const formattedAmount = useMemo(
    () =>
      value && status !== "waiting"
        ? formatCurrencyUnit(unit, value, {
            disableRounding: true,
            alwaysShowSign: false,
            showCode: true,
          })
        : "-",
    [unit, value],
  );

  const formattedTotal = useMemo(
    () =>
      total && total.gt(0)
        ? formatCurrencyUnit(unit, total, {
            disableRounding: true,
            alwaysShowSign: false,
            showCode: true,
          })
        : "-",
    [unit, total],
  );

  const formattedShare = useMemo(
    () =>
      total && total.gt(0)
        ? `${value
            .dividedBy(total)
            .dividedBy(100)
            .toFixed(2)} %`
        : "-",
    [value, total],
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
              <CheckCircle size={14} />
              <StatusLabel>Active</StatusLabel>
            </ToolTip>
          </Box>
        )}
        {status === "inactive" && (
          <Box color="alertRed" pl={2}>
            <ToolTip content={<Trans i18nKey="polkadot.nomination.inactiveTooltip" />}>
              <ExclamationCircleThin size={14} />
              <StatusLabel>Inactive</StatusLabel>
            </ToolTip>
          </Box>
        )}
        {status === "waiting" && (
          <Box color="grey" pl={2}>
            <ToolTip content={<Trans i18nKey="polkadot.nomination.waitingTooltip" />}>
              <Clock size={14} />
              <StatusLabel>Waiting</StatusLabel>
            </ToolTip>
          </Box>
        )}
      </Column>
      <Column>{formattedTotal}</Column>
      <Column>{formattedAmount}</Column>
      <Column>{formattedShare}</Column>
      {/* <Column>
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
      </Column> */}
    </Wrapper>
  );
}

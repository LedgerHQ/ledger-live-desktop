// @flow

import React, { useCallback, useState, useEffect, useMemo, Fragment } from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";
import moment from "moment";
import { BigNumber } from "bignumber.js";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import type {
  CosmosMappedDelegation,
  CosmosMappedUnbonding,
} from "@ledgerhq/live-common/lib/families/cosmos/types";
import type { Account } from "@ledgerhq/live-common/lib/types";
import { canUndelegate } from "@ledgerhq/live-common/lib/families/cosmos/logic";

import { TableLine } from "./Header";
import DropDown, { DropDownItem } from "~/renderer/components/DropDownSelector";

import Box from "~/renderer/components/Box/Box";
import ChevronRight from "~/renderer/icons/ChevronRight";
import CheckCircle from "~/renderer/icons/CheckCircle";
import ExclamationCircleThin from "~/renderer/icons/ExclamationCircleThin";
import ToolTip from "~/renderer/components/Tooltip";
import FirstLetterIcon from "~/renderer/components/FirstLetterIcon";
import Text from "~/renderer/components/Text";

import { openURL } from "~/renderer/linking";
import { denominate } from "../helpers";

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
}) => (
  <Fragment>
    {item.key === "MODAL_COSMOS_CLAIM_REWARDS" && <Divider />}

    <ToolTip content={item.tooltip} containerStyle={{ width: "100%" }}>
      <DropDownItem disabled={item.disabled} isActive={isActive}>
        <Box horizontal alignItems="center" justifyContent="center">
          <Text ff="Inter|SemiBold">{item.label}</Text>
        </Box>
      </DropDownItem>
    </ToolTip>
  </Fragment>
);

type Props = {
  account: Account,
  delegation: any,
  onManageAction: (
    address: string,
    action: "MODAL_ELROND_UNDELEGATE" | "MODAL_ELROND_CLAIM_REWARDS",
  ) => void,
};

export function Row({
  account,
  delegation: { contract, userActiveStake, claimableRewards, validator, status },
  delegation,
  onManageAction,
}: Props) {
  const onSelect = useCallback(
    action => {
      onManageAction(contract, action.key, userActiveStake);
    },
    [onManageAction, contract],
  );

  const _canUndelegate = true; // || canUndelegate(account);
  const dropDownItems = useMemo(
    () => [
      {
        key: "MODAL_ELROND_UNDELEGATE",
        label: <Trans i18nKey="cosmos.delegation.undelegate" />,
        disabled: !_canUndelegate,
        tooltip: !_canUndelegate ? (
          <Trans i18nKey="cosmos.delegation.undelegateDisabledTooltip">
            <b></b>
          </Trans>
        ) : null,
      },
      ...(BigNumber(claimableRewards).gt(0)
        ? [
            {
              key: "MODAL_ELROND_CLAIM_REWARDS",
              label: <Trans i18nKey="cosmos.delegation.reward" />,
            },
          ]
        : []),
    ],
    [_canUndelegate, claimableRewards],
  );
  const name = validator?.name ?? contract;
  const amount = denominate({
    input: userActiveStake,
    showLastNonZeroDecimal: true,
  });

  const rewards = denominate({
    input: claimableRewards,
    showLastNonZeroDecimal: true,
  });

  return (
    <Wrapper>
      <Column
        strong
        clickable
        onClick={() => openURL(`https://testnet-explorer.elrond.com/providers/${contract}`)}
      >
        <Box mr={2}>
          <FirstLetterIcon label={name} />
        </Box>
        <Ellipsis>{name}</Ellipsis>
      </Column>
      <Column>
        {/* {status === "bonded" ? ( */}
        <Box color="positiveGreen" pl={2}>
          <ToolTip content={<Trans i18nKey="cosmos.delegation.activeTooltip" />}>
            <CheckCircle size={14} />
          </ToolTip>
        </Box>
        {/* ) : (
        <Box color="alertRed" pl={2}>
          <ToolTip content={<Trans i18nKey="cosmos.delegation.inactiveTooltip" />}>
            <ExclamationCircleThin size={14} />
          </ToolTip>
        </Box>
        )} */}
      </Column>
      <Column>{amount} EGLD</Column>
      <Column>{rewards} EGLD</Column>
      <Column>
        <DropDown items={dropDownItems} renderItem={ManageDropDownItem} onChange={onSelect}>
          {() => (
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

export function UnbondingRow({ contract, seconds, validator, amount }: any) {
  const [counter, setCounter] = useState<number>(seconds);

  const name = validator?.name ?? contract;
  const balance = denominate({
    input: amount,
    showLastNonZeroDecimal: true,
  });

  const getTime = useCallback(() => {
    const duration = moment.duration(counter, "seconds");
    const formatters = {
      d: [duration.asDays(), Math.floor(duration.asDays())],
      h: [duration.asHours(), "H"],
      m: [duration.asMinutes(), "m"],
      s: [duration.asSeconds(), "s"],
    };

    const format = Object.keys(formatters).reduce((total, key) => {
      const [time, label] = formatters[key];

      if (Math.floor(time) > 0) {
        return total === "" ? `${label}[${key}]` : `${total} : ${label}[${key}]`;
      }

      return total;
    }, "");

    return moment.utc(moment.duration(counter, "seconds").asMilliseconds()).format(format);
  }, [counter]);

  const handleCounter = () => {
    const interval = setInterval(() => setCounter(timer => timer - 1), 1000);

    return () => {
      clearInterval(interval);
      setCounter(seconds);
    };
  };

  useEffect(handleCounter, [seconds]);

  return (
    <Wrapper>
      <Column
        strong={true}
        clickable={true}
        onClick={() => openURL(`https://testnet-explorer.elrond.com/providers/${contract}`)}
      >
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
      <Column>{balance} EGLD</Column>
      <Column>{counter > 0 ? getTime() : "N/A"}</Column>
    </Wrapper>
  );
}

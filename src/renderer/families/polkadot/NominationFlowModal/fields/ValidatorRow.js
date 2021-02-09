// @flow
import { BigNumber } from "bignumber.js";
import React, { useCallback, useMemo, memo } from "react";
import styled, { css } from "styled-components";
import { Trans } from "react-i18next";
import { Polkadot as PolkadotIdenticon } from "@polkadot/react-identicon/icons";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import type { Unit } from "@ledgerhq/live-common/lib/types";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";
import type { PolkadotValidator } from "@ledgerhq/live-common/lib/families/polkadot/types";

import Box from "~/renderer/components/Box";
import Text from "~/renderer/components/Text";
import CheckBox from "~/renderer/components/CheckBox";
import Tooltip from "~/renderer/components/Tooltip";
import ExternalLink from "~/renderer/icons/ExternalLink";

const IconContainer: ThemedComponent<*> = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: ${p => p.theme.colors.palette.text.shade60};
`;

const InfoContainer = styled(Box).attrs(() => ({
  vertical: true,
  ml: 2,
  flexShrink: 0,
  mr: "auto",
}))``;

const Title = styled(Box).attrs(() => ({
  horizontal: true,
  alignItems: "center",
}))`
  width: min-content;
  max-width: 100%;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  color: ${p => p.theme.colors.palette.text.shade100};
  ${IconContainer} {
    background-color: rgba(0, 0, 0, 0);
    color: ${p => p.theme.colors.palette.primary.main};
    opacity: 0;
  }
  &:hover {
    color: ${p => p.theme.colors.palette.primary.main};
  }
  &:hover > ${IconContainer} {
    opacity: 1;
  }
  ${Text} {
    flex: 0 1 auto;
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const SubTitle = styled(Box).attrs(() => ({
  horizontal: true,
}))`
  font-size: 11px;
  font-weight: 500;
  color: ${p => p.theme.colors.palette.text.shade60};
`;

const Status = styled(Text)`
  font-size: 11px;
  font-weight: 700;
  color: ${p => (p.isElected ? p.theme.colors.positiveGreen : p.theme.colors.palette.text.shade60)};
`;

const TotalStake = styled.span`
  margin-left: 4px;
  padding-left: 4px;
  border-left: 1px solid ${p => p.theme.colors.palette.text.shade30};
`;

const NominatorsCount = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: ${p =>
    p.isOversubscribed ? p.theme.colors.warning : p.theme.colors.palette.text.shade100};
`;

const Commission = styled.span`
  font-size: 11px;
  font-weight: 500;
`;

const SideInfo = styled(Box).attrs(() => ({
  alignItems: "flex-end",
  textAlign: "right",
}))`
  margin-right: 8px;
`;

const Row: ThemedComponent<{ active: boolean, disabled: boolean }> = styled(Box).attrs(() => ({
  horizontal: true,
  flex: "0 0 56px",
  mb: 2,
  alignItems: "center",
  justifyContent: "flex-start",
  p: 2,
}))`
  border-radius: 4px;
  border: 1px solid transparent;
  position: relative;
  overflow: visible;
  border-color: ${p =>
    p.active ? p.theme.colors.palette.primary.main : p.theme.colors.palette.divider};
  ${p =>
    p.active
      ? `&:before {
        content: "";
        width: 4px;
        height: 100%;
        top: 0;
        left: 0;
        position: absolute;
        background-color: ${p.theme.colors.palette.primary.main};
      }`
      : ""}

  ${p =>
    p.disabled && !p.active
      ? css`
          opacity: 0.5;
        `
      : ""}
`;

type ValidatorRowProps = {
  validator: PolkadotValidator,
  unit: Unit,
  isSelected: boolean,
  disabled?: boolean,
  maxNominatorRewardedPerValidator: number,
  onClick?: (*) => void,
  onUpdateVote?: (string, boolean) => void,
  onExternalLink: (address: string) => void,
  style?: *,
};

const ValidatorRow = ({
  validator,
  unit,
  isSelected,
  disabled,
  maxNominatorRewardedPerValidator,
  onUpdateVote,
  onExternalLink,
  onClick = () => {},
  style,
}: ValidatorRowProps) => {
  const {
    identity,
    address,
    commission,
    totalBonded,
    isElected,
    isOversubscribed,
    nominatorsCount,
  } = validator;

  const commissionBN = BigNumber(commission); // FIXME: Y U NO BIGNUMBER ?
  const totalBN = BigNumber(totalBonded); // FIXME: Y U NO BIGNUMBER ?

  const onTitleClick = useCallback(
    e => {
      e.stopPropagation();
      onExternalLink(address);
    },
    [onExternalLink, address],
  );

  const onToggle = useCallback(
    e => {
      onUpdateVote && (!disabled || isSelected) && onUpdateVote(address, !isSelected);
    },
    [onUpdateVote, address, disabled, isSelected],
  );

  const formattedCommission = useMemo(
    () => (commissionBN ? `${commissionBN.multipliedBy(100).toFixed(2)} %` : "-"),
    [commissionBN],
  );

  const formattedTotal = useMemo(
    () =>
      totalBN && totalBN.gt(0)
        ? formatCurrencyUnit(unit, totalBN, {
            disableRounding: false,
            alwaysShowSign: false,
            showCode: true,
            showAllDigits: false,
          })
        : "",
    [unit, totalBN],
  );
  return (
    <Row style={style} disabled={!!disabled} active={!!isSelected}>
      <IconContainer>
        <PolkadotIdenticon address={address} size={24} />
      </IconContainer>
      <InfoContainer>
        <Tooltip content={identity ? address : null}>
          <Title onClick={onTitleClick}>
            <Text>{identity || address}</Text>
            <IconContainer>
              <ExternalLink size={16} />
            </IconContainer>
          </Title>
        </Tooltip>
        <SubTitle>
          <Status isElected={isElected}>
            {isElected ? (
              <Trans i18nKey="polkadot.nomination.elected" />
            ) : (
              <Trans i18nKey="polkadot.nomination.waiting" />
            )}
          </Status>
          {isElected ? (
            <TotalStake>
              <Trans i18nKey="polkadot.nomination.totalStake" />: {formattedTotal}
            </TotalStake>
          ) : null}
        </SubTitle>
      </InfoContainer>
      <SideInfo>
        <Commission>
          <Trans i18nKey="polkadot.nomination.commission" />: {formattedCommission}
        </Commission>
        {isElected ? (
          <Tooltip
            content={
              isOversubscribed ? (
                <Trans
                  i18nKey="polkadot.nomination.oversubscribedTooltip"
                  values={{ maxNominatorRewardedPerValidator }}
                />
              ) : (
                <Trans
                  i18nKey="polkadot.nomination.nominatorsTooltip"
                  values={{ count: nominatorsCount }}
                />
              )
            }
          >
            <NominatorsCount isOversubscribed={isOversubscribed}>
              <Trans
                i18nKey={
                  isOversubscribed
                    ? "polkadot.nomination.oversubscribed"
                    : "polkadot.nomination.nominatorsCount"
                }
                values={{ nominatorsCount }}
              />
            </NominatorsCount>
          </Tooltip>
        ) : null}
      </SideInfo>
      <CheckBox disabled={!isSelected && disabled} isChecked={isSelected} onChange={onToggle} />
    </Row>
  );
};

export default memo<ValidatorRowProps>(ValidatorRow);

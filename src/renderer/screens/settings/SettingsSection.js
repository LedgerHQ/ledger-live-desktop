// @flow

import React from "react";
import styled from "styled-components";
import { rgba } from "~/renderer/styles/helpers";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Box, { Card } from "~/renderer/components/Box";

export const SettingsSection: ThemedComponent<{}> = styled(Card).attrs(() => ({ p: 0 }))``;

export const SettingsSectionHeaderContainer: ThemedComponent<{}> = styled(Box).attrs(() => ({
  p: 4,
  horizontal: true,
  alignItems: "center",
}))`
  line-height: normal;
`;

const RoundIconContainer: ThemedComponent<{}> = styled(Box).attrs(p => ({
  alignItems: "center",
  justifyContent: "center",
  bg: rgba(p.theme.colors.wallet, 0.2),
  color: "wallet",
}))`
  height: 34px;
  width: 34px;
  border-radius: 50%;
`;

export const SettingsSectionBody: ThemedComponent<{}> = styled(Box)`
  border-top: 1px solid ${p => p.theme.colors.palette.divider};
  border-bottom: 1px solid ${p => p.theme.colors.palette.divider};
  > * + * {
    position: relative;
    &:after {
      background: ${p => p.theme.colors.palette.divider};
      content: "";
      display: block;
      height: 1px;
      left: ${p => p.theme.space[4]}px;
      position: absolute;
      right: ${p => p.theme.space[4]}px;
      top: 0;
    }
  }
`;

type SettingsSectionHeaderProps = {
  title: string,
  desc: string,
  icon: any,
  renderRight?: any,
  onClick?: () => void,
  style?: any,
};

export const SettingsSectionHeader = ({
  title,
  desc,
  icon,
  renderRight = undefined,
  onClick,
  style,
}: SettingsSectionHeaderProps) => (
  <SettingsSectionHeaderContainer tabIndex={-1} onClick={onClick} style={style}>
    <RoundIconContainer mr={3}>{icon}</RoundIconContainer>
    <Box grow flex={1} mr={3}>
      <Box ff="Inter|Medium" color="palette.text.shade100">
        {title}
      </Box>
      <Box ff="Inter" fontSize={3} mt={1}>
        {desc}
      </Box>
    </Box>
    {renderRight && (
      <Box alignItems="center" justifyContent="flex-end">
        {renderRight}
      </Box>
    )}
  </SettingsSectionHeaderContainer>
);

export const SettingsSectionRowContainer: ThemedComponent<{}> = styled(Box).attrs(() => ({
  p: 4,
  horizontal: true,
  alignItems: "center",
  relative: true,
  justifyContent: "space-between",
}))``;

type SettingsSectionRowProps = {
  title?: string,
  desc: string,
  children?: any,
  onClick?: ?Function,
};

export const SettingsSectionRow = ({
  title,
  desc,
  children = null,
  onClick = null,
}: SettingsSectionRowProps) => (
  <SettingsSectionRowContainer onClick={onClick} tabIndex={-1}>
    <Box grow shrink style={{ marginRight: "10%" }}>
      {title && (
        <Box ff="Inter|SemiBold" color="palette.text.shade100" fontSize={4}>
          {title}
        </Box>
      )}
      <Box
        ff="Inter"
        fontSize={3}
        color="palette.text.shade60"
        mt={1}
        mr={1}
        style={{ maxWidth: 520 }}
      >
        {desc}
      </Box>
    </Box>
    <Box>{children}</Box>
  </SettingsSectionRowContainer>
);

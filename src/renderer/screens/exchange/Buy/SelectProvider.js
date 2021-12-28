// @flow

import React from "react";
import styled, { css } from "styled-components";
import { useTranslation } from "react-i18next";

import Text from "~/renderer/components/Text";
import Box from "~/renderer/components/Box";
import { rgba } from "~/renderer/styles/helpers";
import Bullet from "~/renderer/screens/exchange/Buy/Bullet";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const Container: ThemedComponent<{}> = styled(Box).attrs(p => ({
  alignItems: "center",
  cursor: "pointer",
  boxShadow: p.isActive ? `0 0 0 4px ${rgba(p.theme.colors.palette.primary.main, 0.25)}` : "",
  grow: 1,
}))`
  border: 1px solid ${p => p.theme.colors.palette.divider};
  border-radius: 4px;

  &:hover {
    ${p =>
      css`
        box-shadow: 0 0 0 4px ${rgba(p.theme.colors.palette.primary.main, 0.25)};
        border: ${p => `1px solid ${p.theme.colors.palette.primary.main}`};
      `}
  }
`;

type Props = {
  children: React$Node,
  provider: string,
  cryptoCount: number,
  onClick: Function,
  isActive: boolean,
};

const SelectProvider = ({ children, provider, cryptoCount, onClick, isActive }: Props) => {
  const { t } = useTranslation();

  return (
    <Container py={20} onClick={onClick} isActive={isActive}>
      {children}
      <Text ff="Inter|SemiBold" color="palette.text.shade100" my={24}>
        {provider}
      </Text>
      <Bullet margin="8px" value={t("exchange.buy.buyFrom")} />
      <Bullet margin="8px" value={`${cryptoCount}+ ${t("exchange.buy.cryptoSupported")}`} />
      <Bullet value={t("exchange.buy.payWith")} />
    </Container>
  );
};

export default SelectProvider;

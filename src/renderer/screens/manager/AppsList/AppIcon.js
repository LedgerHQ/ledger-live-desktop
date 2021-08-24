// @flow
import React, { useCallback, useState } from "react";
import styled, { withTheme } from "styled-components";
import manager from "@ledgerhq/live-common/lib/manager";
import { findCryptoCurrencyById, getCurrencyColor } from "@ledgerhq/live-common/lib/currencies";
import type { App } from "@ledgerhq/live-common/lib/types/manager";
import Image from "~/renderer/components/Image";
import { getCryptoCurrencyIcon } from "@ledgerhq/live-common/lib/react";
import ManagerAppIconPlaceholder from "~/renderer/icons/ManagerAppIcon";

const size = 40;
// trick to format size for certain type of icons
const Container = styled.div`
  width: ${size}px;
  height: ${size}px;
  background-color: ${p => p.color};
  border-radius: 14px;
  position: relative;
  overflow: hidden;

  > svg {
    position: absolute;
    top: 2.5px;
    left: 2.5px;
    width: ${size - 5}px;
    height: ${size - 5}px;
  }
`;

const ManagerAppIconContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  transition: opacity 0.2s ease-out;
  color: ${p => p.theme.colors.palette.text.shade20};
`;

const IconContainer = styled.div`
  width: ${p => p.size}px;
  height: ${p => p.size}px;
  position: relative;
  ${ManagerAppIconContainer} {
    opacity: ${p => (p.loading ? 1 : 0)};
  }
  > img {
    transition: opacity 0.2s ease-out;
    z-index: 1;
    opacity: ${p => (p.loading ? 0 : 1)};
  }
`;

type Props = {
  app: App,
  theme: any,
};

function AppIcon({ app, theme }: Props) {
  const { currencyId, icon } = app;
  const [loading, setLoading] = useState(true);
  const onLoad = useCallback(() => setLoading(false), []);

  const iconUrl = manager.getIconUrl(icon);

  const currency = currencyId && findCryptoCurrencyById(currencyId);
  const currencyColor = currency && getCurrencyColor(currency);
  const IconCurrency = currency && getCryptoCurrencyIcon(currency);

  return IconCurrency ? (
    <Container color={currencyColor}>
      <IconCurrency size={size} color="#FFF" />
    </Container>
  ) : (
    <IconContainer loading={loading} size={size}>
      <ManagerAppIconContainer>
        <ManagerAppIconPlaceholder size={size} />
      </ManagerAppIconContainer>
      <Image alt="" onLoad={onLoad} resource={iconUrl} width={size} height={size} />
    </IconContainer>
  );
}

export default withTheme(AppIcon);

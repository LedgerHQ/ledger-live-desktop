// @flow
import React, { memo } from "react";
import styled, { withTheme } from "styled-components";
import manager from "@ledgerhq/live-common/lib/manager";
import { findCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import type { App } from "@ledgerhq/live-common/lib/types/manager";
import Image from "~/renderer/components/Image";
import { getCryptoCurrencyIcon } from "@ledgerhq/live-common/lib/react";
import { getCurrencyColor } from "~/renderer/getCurrencyColor";

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

type Props = {
  app: App,
  theme: any,
};

function AppIcon({ app, theme }: Props) {
  const { currencyId, icon } = app;

  const iconUrl = manager.getIconUrl(icon);

  const currency = currencyId && findCryptoCurrencyById(currencyId);
  const currencyColor =
    currency && getCurrencyColor(currency, theme.colors.palette.background.paper);
  const IconCurrency = currency && getCryptoCurrencyIcon(currency);

  return IconCurrency ? (
    <Container color={currencyColor}>
      <IconCurrency size={size} color="#FFF" />
    </Container>
  ) : (
    <Image alt="" resource={iconUrl} width={size} height={size} />
  );
}

export default withTheme(AppIcon);

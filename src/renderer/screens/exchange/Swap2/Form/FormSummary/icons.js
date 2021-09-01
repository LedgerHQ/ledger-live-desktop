/* eslint-disable react/display-name */
// @flow
import React from "react";
import CryptoCurrencyIcon from "~/renderer/components/CryptoCurrencyIcon";
import IconChangelly from "~/renderer/icons/providers/Changelly";
import IconLock from "~/renderer/icons/Lock";
import type { TokenCurrency, CryptoCurrency } from "@ledgerhq/live-common/lib/types";

export const getProviderIcon = (provider?: string) => {
  if (!provider) return null;

  const providerIcons = { changelly: IconChangelly };
  const Icon = providerIcons[provider.toLowerCase()];
  return () => <Icon size={20} />;
};

export const RateIcon = () => <IconLock size={16} />;

export const getTargetIcon = (currency?: TokenCurrency | CryptoCurrency) => {
  if (!currency) return null;

  return () => <CryptoCurrencyIcon circle currency={currency} size={16} />;
};

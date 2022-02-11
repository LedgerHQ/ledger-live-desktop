// @flow

import React, { useState } from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import type { Account, AccountLike } from "@ledgerhq/live-common/lib/types/account";
import Text from "~/renderer/components/Text";
import IconChevronRight from "~/renderer/icons/ChevronRightSmall";
import { useTranslation } from "react-i18next";
import LiveAppIcon from "~/renderer/components/WebPlatformPlayer/LiveAppIcon";
import { useLiveAppManifest } from "@ledgerhq/live-common/lib/platform/providers/LiveAppProvider";
import {
  RampLiveAppCatalogEntry,
  RampCatalogEntry,
} from "@ledgerhq/live-common/lib/platform/providers/RampCatalogProvider/types";

import applepayLogo from "./assets/applepay.svg";
import googlepayLogo from "./assets/googlepay.svg";
import maestroLogo from "./assets/maestro.svg";
import mastercardLogo from "./assets/mastercard.svg";
import paypalLogo from "./assets/paypal.svg";
import sepaLogo from "./assets/sepa.svg";
import visaLogo from "./assets/visa.svg";
import WebPlatformPlayer from "~/renderer/components/WebPlatformPlayer";
import { filterRampCatalogEntries } from "@ledgerhq/live-common/lib/platform/providers/RampCatalogProvider/helpers";

const assetMap = {
  applepay: applepayLogo,
  googlepay: googlepayLogo,
  maestro: maestroLogo,
  mastercard: mastercardLogo,
  paypal: paypalLogo,
  sepa: sepaLogo,
  visa: visaLogo,
};

const Container: ThemedComponent<{}> = styled.div`
  display: flex;
  flex-direction: column;
  margin: 40px 0px;
`;

const ProviderCardContainer: ThemedComponent<{}> = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 16px;
  border-radius: 8px;
  margin: 4px 0px;
  user-select: none;
  width: 480px;
  position: relative;
  background: ${p => p.theme.colors.palette.background.default};

  &:hover {
    cursor: pointer;
    opacity: 0.8;
  }

  &:active {
    opacity: 0.7;
  }
`;

const ProviderCardTopContainer: ThemedComponent<{}> = styled.div`
  display: flex;
  justify-content: center;
`;

const ChevronContainer: ThemedComponent<{}> = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 20px;
  height: 100%;
  display: flex;
  align-items: center;
  color: ${p => p.theme.colors.palette.text.shade100};
`;

const PaymentSystemListContainer: ThemedComponent<{}> = styled.div`
  display: inline-flex;
  margin-top: 16px;
  gap: 6px;
  width: 100%;
  flex-wrap: wrap;
  pointer-events: none;
`;

const PaymentSystemContainer: ThemedComponent<{}> = styled.div`
  display: flex;
  border: 1px solid ${p => p.theme.colors.palette.text.shade30};
  text-transform: uppercase;
  padding: 6px;
  border-radius: 4px;
`;

const PaymentSystemLogo: ThemedComponent<{}> = styled.img``;

type ProviderCardProps = {
  provider: RampLiveAppCatalogEntry,
  onClick: () => void,
};

function ProviderCard({ provider, onClick }: ProviderCardProps) {
  const manifest = useLiveAppManifest(provider.appId);

  if (!manifest) {
    return null;
  }

  return (
    <ProviderCardContainer onClick={onClick}>
      <ProviderCardTopContainer>
        <LiveAppIcon size={32} icon={manifest.icon} name={provider.name} />
        <Text
          ff="Inter|Medium"
          fontSize="16px"
          lineHeight="32px"
          color="palette.text.shade100"
          style={{ marginLeft: 8 }}
        >
          {provider.name}
        </Text>
      </ProviderCardTopContainer>
      <PaymentSystemListContainer>
        {provider.paymentProviders.map(paymentProvider => (
          <PaymentSystemContainer key={paymentProvider}>
            {assetMap[paymentProvider] ? (
              <PaymentSystemLogo src={assetMap[paymentProvider]} />
            ) : (
              <Text
                ff="Inter|Medium"
                fontSize="16px"
                lineHeight="12px"
                color="palette.text.shade100"
              >
                {paymentProvider}
              </Text>
            )}
          </PaymentSystemContainer>
        ))}
      </PaymentSystemListContainer>
      <ChevronContainer>
        <IconChevronRight size={15} />
      </ChevronContainer>
    </ProviderCardContainer>
  );
}

type TradeParams = {
  type: "onRamp" | "offRamp",
  cryptoCurrencyId: string,
  fiatCurrencyId: string,
  amount: number,
  amountCurrency: "crypto" | "fiat",
};

type ProviderViewProps = {
  provider: RampLiveAppCatalogEntry,
  onClose: () => void,
  account: AccountLike,
  trade: TradeParams,
};

function ProviderView({ provider, onClose, trade }: ProviderViewProps) {
  const manifest = useLiveAppManifest(provider.appId);
  const inputs = {};

  if (trade.cryptoCurrencyId) {
    inputs.cryptoCurrencyId = trade.cryptoCurrencyId;
  }

  if (trade.fiatCurrencyId) {
    inputs.cryptoCurrencyId = trade.fiatCurrencyId;
  }

  if (trade.type) {
    inputs.mode = trade.type;
  }

  if (trade.amount && trade.amountCurrency) {
    inputs.amount = trade.amount;
    inputs.amountCurrency = trade.amountCurrency;
  }

  return <WebPlatformPlayer onClose={onClose} manifest={manifest} inputs={inputs} />;
}

// account.token ? account.token.id : account.currency.id;

type ProviderListProps = {
  account: AccountLike,
  parentAccount?: ?Account,
  onBack?: () => void,
  providers: RampCatalogEntry[],
  trade: TradeParams,
};

export function ProviderList({
  account,
  parentAccount,
  onBack,
  providers,
  trade,
}: ProviderListProps) {
  const [selectedProvider, setSelectedProvider] = useState(null);
  const { t } = useTranslation();

  const filteredProviders = filterRampCatalogEntries(providers, {
    cryptoCurrencies: trade.cryptoCurrencyId ? [trade.cryptoCurrencyId] : undefined,
    fiatCurrencies: trade.fiatCurrencyId ? [trade.fiatCurrencyId] : undefined,
  });

  if (selectedProvider) {
    return (
      <ProviderView
        provider={selectedProvider}
        onClose={() => setSelectedProvider(null)}
        account={account}
        trade={trade}
      />
    );
  }

  return (
    <Container>
      <Text ff="Inter|Regular" fontSize="13px" lineHeight="15.73px" color="palette.text.shade60">
        {t("exchange.chooseProviders", { providerCount: filteredProviders.length })}
      </Text>
      {filteredProviders.map(provider =>
        provider.type === "LIVE_APP" ? (
          <ProviderCard
            provider={provider}
            key={provider.name}
            onClick={() => setSelectedProvider(provider)}
          />
        ) : null,
      )}
    </Container>
  );
}

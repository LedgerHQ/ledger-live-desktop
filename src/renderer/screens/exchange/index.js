// @flow

import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import TrackPage from "~/renderer/analytics/TrackPage";
import Box, { Card } from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";
import LiveAppIcon from "~/renderer/components/WebPlatformPlayer/LiveAppIcon";

import CardButton from "~/renderer/components/CardButton";
import BulletList from "~/renderer/components/BulletList";
import IconWyre from "~/renderer/icons/providers/Wyre";

const Grid = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  justify-content: center;
  flex-wrap: wrap;
  padding: 12px;
  width: 100%;
`;

const GridItem = styled.div`
  margin: 12px;
  > * {
    height: 100%;
  }
`;

const Header: ThemedComponent<{}> = styled(Box).attrs(p => ({
  fontSize: 4,
  textAlign: "center",
  alignItems: "center",
}))`
  padding: 48px 24px 24px;
`;

const Footer: ThemedComponent<{}> = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid ${p => p.theme.colors.palette.divider};
  padding: 20px 24px;
  &:empty {
    display: none;
  }
  & > :only-child {
    margin-left: auto;
  }
  > * + * {
    margin-left: 10px;
  }
`;

const Title: ThemedComponent<{}> = styled(Box).attrs(p => ({
  ff: "Inter|SemiBold",
  fontSize: 6,
  color: p.theme.colors.palette.secondary.main,
  mb: 2,
}))``;

const Description: ThemedComponent<{}> = styled(Box).attrs(p => ({
  ff: "Inter|Medium",
  mb: 2,
}))`
  max-width: 640px;
`;

const PROVIDERS = [
  {
    provider: "wyre",
    name: "Wyre",
    icon: <IconWyre size={50} />,
    disabled: false,
  },
  {
    provider: "coinify",
    name: "Coinify",
    icon: <LiveAppIcon name="Coinify" size={50} />, // FIXME: add Coinify icon
    disabled: false,
  },
];

const SelectProvider = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const [provider, setProvider] = useState<string | null>(null);

  const handleSelectProvider = useCallback((providerId: string) => setProvider(providerId), []);

  const handleLearnMore = useCallback(() => alert("learnMore"), []);

  const handleClick = useCallback(() => {
    const conf = PROVIDERS.find(p => p.provider === provider);
    if (conf) {
      history.push(`/exchange/${conf.provider}`);
    }
  }, [history, provider]);

  return (
    <>
      <TrackPage category="Exchange" name="SelectProvider" />
      <Card flow={1}>
        <Header>
          <Title>{t("exchange.providers.title")}</Title>
          <Description>{t("exchange.providers.description")}</Description>
          <LinkWithExternalIcon onClick={handleLearnMore}>
            {t("exchange.providers.learnMore")}
          </LinkWithExternalIcon>
        </Header>
        <Grid length={PROVIDERS.length}>
          {PROVIDERS.map(p => (
            <GridItem key={p.provider}>
              <CardButton
                title={p.name}
                icon={p.icon}
                onClick={() => handleSelectProvider(p.provider)}
                isActive={p.provider === provider}
                disabled={p.disabled || false}
              >
                <BulletList
                  bullets={t(`exchange.providers.${p.provider}.bullets`, {
                    joinArrays: ";",
                    defaultValue: "",
                  })
                    .split(";")
                    .filter(Boolean)}
                />
              </CardButton>
            </GridItem>
          ))}
        </Grid>
        <Footer>
          <Button primary onClick={handleClick} disabled={!provider}>
            {t("common.continue")}
          </Button>
        </Footer>
      </Card>
    </>
  );
};

export default SelectProvider;

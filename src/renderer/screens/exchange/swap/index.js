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
import IconChangelly from "~/renderer/icons/providers/Changelly";
import IconParaswap from "~/renderer/icons/providers/Paraswap";
import IconWyre from "~/renderer/icons/providers/Wyre";

const getColumnsTemplate = length =>
  length >= 3 ? "1fr 1fr  1fr" : length === 2 ? "1fr  1fr" : "1fr";

const Grid = styled.div`
  display: grid;
  grid-gap: 24px;
  padding: 24px;
  grid-template-columns: ${p => getColumnsTemplate(p.length)};
  width: 100%;
`;

const Header: ThemedComponent<{}> = styled(Box).attrs(p => ({
  fontSize: 4,
  textAlign: "center",
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

const PROVIDERS = [
  // {
  //   provider: "wyre",
  //   name: "Wyre",
  //   isDapp: false,
  //   icon: <IconWyre size={50} />,
  //   disabled: true,
  // },
  {
    provider: "changelly",
    name: "Changelly",
    isDapp: false,
    icon: <IconChangelly size={50} />,
  },
  {
    provider: "paraswap",
    name: "ParaSwap",
    isDapp: true,
    icon: <IconParaswap size={50} />,
  },
];

if (process.env.NODE_ENV === "development") {
  PROVIDERS.push({
    provider: "debug",
    name: "Debugger",
    isDapp: true,
    icon: <LiveAppIcon name="Debugger" size={50} />,
  });
}

const SelectProvider = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const [provider, setProvider] = useState<string | null>(null);

  const handleSelectProvider = useCallback((providerId: string) => setProvider(providerId), []);

  const handleLearnMore = useCallback(() => alert("learnMore"), []);

  const handleClick = useCallback(() => {
    const conf = PROVIDERS.find(p => p.provider === provider);
    if (conf) {
      if (conf.isDapp) {
        history.push(`/swap/dapp/${conf.provider}`);
      } else {
        history.push("/swap/integrated");
      }
    }
  }, [history, provider]);

  return (
    <>
      <TrackPage category="Swap" name="SelectProvider" />
      <Card flow={1}>
        <Header>
          <Title>{t("swap.providers.title")}</Title>
          <LinkWithExternalIcon onClick={handleLearnMore}>
            {t("swap.providers.learnMore")}
          </LinkWithExternalIcon>
        </Header>
        <Grid length={PROVIDERS.length}>
          {PROVIDERS.map(p => (
            <CardButton
              key={p.provider}
              title={p.name}
              icon={p.icon}
              onClick={() => handleSelectProvider(p.provider)}
              isActive={p.provider === provider}
              disabled={p.disabled || false}
            >
              <BulletList
                bullets={t(`swap.providers.${p.provider}.bullets`, {
                  joinArrays: ";",
                  defaultValue: "",
                })
                  .split(";")
                  .filter(Boolean)}
              />
            </CardButton>
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

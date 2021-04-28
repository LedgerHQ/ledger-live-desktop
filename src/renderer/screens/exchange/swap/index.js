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
import IconChangelly from "~/renderer/icons/swap/Changelly";
import IconParaswap from "~/renderer/icons/swap/Paraswap";
import IconWyre from "~/renderer/icons/swap/Wyre";

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

const PROVIDERS = {
  wyre: {
    name: "Wyre",
    isDapp: false,
    icon: <IconWyre size={50} />,
    disabled: true,
  },
  changelly: {
    provider: "changelly",
    name: "Changelly",
    isDapp: false,
    icon: <IconChangelly size={50} />,
  },
  paraswap: {
    name: "ParaSwap",
    isDapp: true,
    icon: <IconParaswap size={50} />,
  },
  ...(process.env.NODE_ENV === "development"
    ? {
        debug: {
          name: "Debugger",
          isDapp: true,
          icon: <LiveAppIcon platform="debug" size={50} />,
        },
      }
    : {}),
};

const SelectProvider = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const [provider, setProvider] = useState(null);

  const handleSelectProvider = useCallback(provider => setProvider(provider), []);

  const handleLearnMore = useCallback(() => alert("learnMore"), []);

  const handleClick = useCallback(() => {
    if (provider && PROVIDERS[provider]) {
      if (PROVIDERS[provider].isDapp) {
        history.push(`/swap/dapp/${provider}`);
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
        <Grid length={Object.keys(PROVIDERS).length}>
          {Object.keys(PROVIDERS).map(providerId => (
            <CardButton
              key={providerId}
              title={PROVIDERS[providerId].name}
              icon={PROVIDERS[providerId].icon}
              onClick={() => handleSelectProvider(providerId)}
              isActive={provider === providerId}
              disabled={PROVIDERS[providerId].disabled || false}
            >
              <BulletList
                bullets={t(`swap.providers.${providerId}.bullets`, {
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

// @flow

import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import { urls } from "~/config/urls";
import { openURL } from "~/renderer/linking";
import TrackPage from "~/renderer/analytics/TrackPage";
import Alert from "~/renderer/components/Alert";
import Box, { Card } from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";
import LiveAppIcon from "~/renderer/components/WebPlatformPlayer/LiveAppIcon";

import CardButton from "~/renderer/components/CardButton";
import BulletList from "~/renderer/components/BulletList";
import IconChangelly from "~/renderer/icons/providers/Changelly";
import IconParaswap from "~/renderer/icons/providers/Paraswap";
// import IconWyre from "~/renderer/icons/providers/Wyre";

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
  //   icon: <IconWyre size={32} />,
  //   disabled: true,
  //   kycRequired: true,
  // },
  {
    provider: "paraswap",
    name: "ParaSwap",
    isDapp: true,
    icon: <IconParaswap size={32} />,
    disabled: false,
    kycRequired: false,
  },
  {
    provider: "changelly",
    name: "Changelly",
    isDapp: false,
    icon: <IconChangelly size={32} />,
    disabled: false,
    kycRequired: false,
  },
];

if (__DEV__) {
  PROVIDERS.push({
    provider: "debug",
    name: "Debugger",
    isDapp: true,
    icon: <LiveAppIcon name="Debugger" size={32} />,
    disabled: false,
    kycRequired: false,
  });
}

const SelectProvider = () => {
  const history = useHistory();
  const { t } = useTranslation();
  const [provider, setProvider] = useState<string | null>(null);

  const handleSelectProvider = useCallback((providerId: string) => setProvider(providerId), []);

  const handleLearnMore = useCallback(() => {
    openURL(urls.swap.learnMore);
  }, []);

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
          {PROVIDERS.map(p => {
            const description = t(`swap.providers.${p.provider}.description`, { defaultValue: "" });
            const bullets = t(`swap.providers.${p.provider}.bullets`, {
              joinArrays: ";",
              defaultValue: "",
            })
              .split(";")
              .filter(Boolean);

            return (
              <GridItem key={p.provider}>
                <CardButton
                  id={`swap-providers-item-${p.provider}`}
                  title={p.name}
                  icon={p.icon}
                  footer={
                    p.kycRequired && (
                      <Alert type="secondary" small>
                        {t("swap.providers.kycRequired")}
                      </Alert>
                    )
                  }
                  onClick={() => handleSelectProvider(p.provider)}
                  isActive={p.provider === provider}
                  disabled={p.disabled || false}
                >
                  {description && <Box mb={4}>{description}</Box>}
                  {!!bullets.length && <BulletList centered bullets={bullets} />}
                </CardButton>
              </GridItem>
            );
          })}
        </Grid>
        <Footer>
          <Button primary onClick={handleClick} disabled={!provider} id="swap-providers-continue">
            {t("common.continue")}
          </Button>
        </Footer>
      </Card>
    </>
  );
};

export default SelectProvider;

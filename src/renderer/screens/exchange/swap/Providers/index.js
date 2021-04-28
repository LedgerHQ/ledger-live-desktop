// @flow

import React, { useCallback, useState } from "react";
import { Trans, useTranslation } from "react-i18next";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import { urls } from "~/config/urls";
import { openURL } from "~/renderer/linking";
import styled from "styled-components";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";
import Item from "./Item";
import Card from "~/renderer/components/Box/Card";

import LiveAppIcon from "~/renderer/components/WebPlatformPlayer/LiveAppIcon";
import IconChangelly from "~/renderer/icons/providers/Changelly";
import IconParaswap from "~/renderer/icons/providers/Paraswap";
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

const Header: ThemedComponent<{}> = styled(Box).attrs(p => ({
  fontSize: 4,
  textAlign: "center",
}))`
  padding: 48px 24px 24px;
`;

const Title: ThemedComponent<{}> = styled(Box).attrs(p => ({
  ff: "Inter|SemiBold",
  fontSize: 6,
  color: p.theme.colors.palette.secondary.main,
  mb: 2,
}))``;

const Footer = styled(Box)`
  border-top: 1px solid ${p => p.theme.colors.palette.text.shade10};
  margin-top: 8px;
  padding: 20px 24px;
  align-items: flex-end;
`;

// Consider moving this logic to live-common (cc Remi/Hakim)
const PROVIDERS = {
  paraswap: {
    id: "paraswap",
    name: "ParaSwap",
    isDapp: true,
    icon: <IconParaswap size={32} />,
    kycRequired: false,
  },
  // Centralized
  changelly: {
    id: "changelly",
    name: "Changelly",
    isDapp: false,
    icon: <IconChangelly size={32} />,
    kycRequired: false,
  },
  wyre: {
    id: "wyre",
    name: "Wyre",
    isDapp: false,
    icon: <IconWyre size={32} />,
    kycRequired: true,
  },
  // Debug
  debug: {
    provider: "debug",
    name: "Debugger",
    isDapp: true,
    icon: <LiveAppIcon name="Debugger" size={32} />,
    disabled: false,
    kycRequired: false,
  },
};

const Providers = ({
  onContinue,
  providers,
}: {
  onContinue: (string, boolean) => void,
  providers: Array<string>,
}) => {
  const { t } = useTranslation();
  const [provider, setProvider] = useState();
  const providersWithConf = providers.map(p => PROVIDERS[p]).filter(Boolean); // Nb Cover missing provider
  const noCentralizedProviders = !providersWithConf.find(p => !p.isDapp);

  const handleLearnMore = useCallback(() => {
    openURL(urls.swap.learnMore);
  }, []);

  const onContinueWrapper = useCallback(() => {
    if (provider) {
      const conf = PROVIDERS[provider];
      onContinue(provider, conf.isDapp);
    }
  }, [onContinue, provider]);

  const getBullets = id =>
    t(`swap.providers.${id}.bullets`, {
      joinArrays: ";",
      defaultValue: "",
    })
      .split(";")
      .filter(Boolean);

  return (
    <>
      <Card justifyContent={"center"}>
        <Header>
          <Title>{t("swap.providers.title")}</Title>
          <LinkWithExternalIcon onClick={handleLearnMore}>
            <Trans i18nKey={"swap.providers.learnMore"} />
          </LinkWithExternalIcon>
        </Header>
        <Grid>
          {providersWithConf.map(({ id, icon, name, kycRequired }) => (
            <Item
              key={id}
              id={id}
              onSelect={setProvider}
              selected={provider}
              icon={icon}
              title={name}
              description={t(`swap.providers.${id}.description`, { defaultValue: "" })}
              bullets={getBullets(id)}
              kyc={kycRequired}
            />
          ))}
          {noCentralizedProviders ? (
            <Item
              key="changelly"
              id="changelly"
              title="Changelly"
              bullets={getBullets("changelly")}
              icon={<IconChangelly size={32} />}
              disabled
            />
          ) : null}
        </Grid>
        <Footer>
          <Button primary onClick={onContinueWrapper} disabled={!provider}>
            <Trans i18nKey={"swap.providers.cta"} />
          </Button>
        </Footer>
      </Card>
    </>
  );
};

export default Providers;

// @flow

import React, { useCallback, useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import TrackPage from "~/renderer/analytics/TrackPage";
import Box, { Card } from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";
import LiveAppIcon from "~/renderer/components/WebPlatformPlayer/LiveAppIcon";

import CardButton from "./CardButton";

const CardList: ThemedComponent<{}> = styled(Box).attrs(p => ({
  flex: 0,
  horizontal: true,
  flexWrap: "wrap",
}))`
  padding: 12px;
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

const SelectProvider = () => {
  const history = useHistory();
  const [provider, setProvider] = useState(null);

  const handleSelectProvider = useCallback(provider => setProvider(provider), []);

  const handleLearnMore = useCallback(() => alert("learnMore"), []);

  const handleClick = useCallback(() => {
    if (provider === "changelly") {
      history.push("/swap/provider");
    } else if (provider) {
      history.push(`/swap/dapp/${provider}`);
    }
  }, [history, provider]);

  return (
    <>
      <TrackPage category="Swap" name="SelectProvider" />
      <Card flow={1}>
        <Header>
          <Title>Choose a provider to swap crypto</Title>
          <LinkWithExternalIcon onClick={handleLearnMore}>What is Swap ?</LinkWithExternalIcon>
        </Header>
        <CardList flow={1} horizontal>
          <CardButton
            title="Changelly"
            icon={<LiveAppIcon platform="changelly" size={50} />}
            onClick={() => handleSelectProvider("changelly")}
            isActive={provider === "changelly"}
          >
            <ul>
              <li>Centralized</li>
              <li>Multi coins and tokens</li>
              <li>Europe, Asia, Africa and Americas</li>
            </ul>
          </CardButton>
          <CardButton
            title="ParaSwap"
            icon={<LiveAppIcon platform="paraswap" size={50} />}
            onClick={() => handleSelectProvider("paraswap")}
            isActive={provider === "paraswap"}
          >
            <ul>
              <li>Decentralized</li>
              <li>Ethereum &amp; ERC20 tokens</li>
              <li>Lorem ipsum</li>
            </ul>
          </CardButton>
          <CardButton
            title="Debugger"
            icon={<LiveAppIcon platform="debug" size={50} />}
            onClick={() => handleSelectProvider("debug")}
            isActive={provider === "debug"}
          >
            <ul>
              <li>Undocumented</li>
              <li>Still Work in Progress</li>
              <li>Functional but partially</li>
            </ul>
          </CardButton>
        </CardList>
        <Footer>
          <Button primary onClick={handleClick} disabled={!provider}>
            Continuer
          </Button>
        </Footer>
      </Card>
    </>
  );
};

export default SelectProvider;

// @flow
import React, { useContext } from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { useSelector } from "react-redux";
import { Trans } from "react-i18next";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import Alert from "~/renderer/components/Alert";
import Text from "~/renderer/components/Text";
import { WaveContainer } from "~/renderer/components/Onboarding/Screens/Tutorial/shared";
import { AnimatedWave } from "~/renderer/components/Onboarding/Screens/Tutorial/assets/AnimatedWave";
import { disconnect } from "./Provider";
import { context, STATUS } from "~/renderer/screens/WalletConnect/Provider";
import WCLogo from "~/renderer/images/walletconnect.png";
import CompanyLogo from "~/renderer/images/logo.png";
import { accountSelector } from "~/renderer/reducers/accounts";
import ParentCryptoCurrencyIcon from "~/renderer/components/ParentCryptoCurrencyIcon";
import IconCheck from "~/renderer/icons/Check";

const Container: ThemedComponent<*> = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  flex: 1;
  background: rgba(100, 144, 241, 0.1);
`;

const InnerContainer: ThemedComponent<*> = styled(Box)`
  position: absolute;
  top: 105px;
  left: 155px;
  right: 155px;
  border-radius: 4px;
  padding: 24px;
`;

const LogoContainer: ThemedComponent<*> = styled.div`
  width: 94px;
  height: 94px;
  border-radius: 94px;
  border: solid 1px rgba(20, 37, 51, 0.1);
  margin-bottom: 20px;
  position: relative;
`;

const CompanyLogoContainer: ThemedComponent<*> = styled.div`
  width: 98px;
  height: 24px;
  margin: 0 auto;
  margin-top: 41px;
`;

const ConnexionStatusContainer: ThemedComponent<*> = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 34px;
  border: solid 3px #fff;
  position: absolute;
  right: 0;
  top: 0;
  background-color: ${p => (p.connected ? p.theme.colors.greenPill : p.theme.colors.orange)};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: bold;
  font-size: 19px;
`;

const AccountContainer: ThemedComponent<*> = styled(Box)`
  width: 100%;
  border: solid 1px ${p => p.theme.colors.palette.divider};
  border-radius: 4px;
`;

const Logo: ThemedComponent<*> = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const InfoBoxContainer: ThemedComponent<*> = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;

const WalletConnect = () => {
  const wcContext = useContext(context);

  const account = useSelector(s => accountSelector(s, { accountId: wcContext.session.accountId }));

  return (
    <Container>
      <WaveContainer>
        <AnimatedWave height={500} color={"#4385F016"} />
      </WaveContainer>
      <CompanyLogoContainer>
        <Logo src={CompanyLogo} />
      </CompanyLogoContainer>
      <InnerContainer alignItems="center" pb={32} bg="palette.background.paper">
        <LogoContainer mb={20}>
          <Logo src={WCLogo} />
          <ConnexionStatusContainer connected={wcContext.socketReady}>
            {wcContext.socketReady ? <IconCheck id="wc-icon-check" color="#fff" size={19} /> : "!"}
          </ConnexionStatusContainer>
        </LogoContainer>
        <Text ff="Inter|Bold" fontSize={4} color="palette.text.shade100">
          {wcContext.dappInfo?.name}
        </Text>

        {wcContext.status === STATUS.DISCONNECTED ? (
          <Trans i18nKey={"walletconnect.disconnected"} />
        ) : (
          <>
            <Text ff="Inter|Regular" fontSize={3} color="palette.text.shade50">
              <Trans
                i18nKey={
                  wcContext.socketReady ? "walletconnect.connected" : "walletconnect.connecting"
                }
              />
            </Text>
            <AccountContainer alignItems={"center"} p={20} mt={36} mb={24}>
              <Box justifyContent="center" horizontal mb="10px">
                {account?.currency ? (
                  <ParentCryptoCurrencyIcon currency={account.currency} />
                ) : null}
                <Text
                  ml={"5px"}
                  textAlign="center"
                  ff="Inter|Bold"
                  fontSize={4}
                  color="palette.text.shade100"
                >
                  {account?.name}
                </Text>
              </Box>
              <Text ff="Inter|SemiBold" fontSize={4} color="palette.text.shade50">
                {account?.freshAddress}
              </Text>
            </AccountContainer>
            {wcContext.socketReady ? (
              <InfoBoxContainer>
                <Alert type="primary">
                  <Trans i18nKey="walletconnect.connectedscreen.info" />
                </Alert>
              </InfoBoxContainer>
            ) : null}
            {wcContext.socketReady ? (
              <InfoBoxContainer>
                <Alert type="warning">
                  <Trans i18nKey="walletconnect.connectedscreen.warning" />
                </Alert>
              </InfoBoxContainer>
            ) : null}
            {!wcContext.socketReady ? (
              <InfoBoxContainer>
                <Alert type="warning">
                  <Trans i18nKey="walletconnect.connectedscreen.disconnected" />
                </Alert>
              </InfoBoxContainer>
            ) : null}
            <Button
              onClick={() => {
                disconnect();
              }}
              primary
              id="wc-disconnect"
            >
              <Trans i18nKey="walletconnect.disconnect" />
            </Button>
          </>
        )}
      </InnerContainer>
    </Container>
  );
};

export default WalletConnect;

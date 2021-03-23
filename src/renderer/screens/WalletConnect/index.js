// @flow

import React from "react";
import styled from "styled-components";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import { WaveContainer } from "~/renderer/components/Onboarding/Screens/Tutorial/shared";
import { AnimatedWave } from "~/renderer/components/Onboarding/Screens/Tutorial/assets/AnimatedWave";
import { disconnect } from "./Provider";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  flex: 1;
  background: ${({ bgTheme, theme }) => {
    if (bgTheme === "light") {
      return "rgba(100, 144, 241, 0.1)";
    }
    if (bgTheme === "dark") {
      return theme.colors.palette.primary.main;
    }
    return "none";
  }};
`;

const WalletConnect = () => {
  const theme = "light";
  return (
    <Container bgTheme={theme}>
      <WaveContainer>
        <AnimatedWave height={500} color={theme === "dark" ? "#587ED4" : "#4385F016"} />
      </WaveContainer>
      <Box
        style={{
          position: "absolute",
          bottom: "105px",
          top: "105px",
          left: "155px",
          right: "155px",
        }}
      >
        coucou
        <Button
          onClick={() => {
            disconnect();
          }}
          primary
        >
          Disconnect
        </Button>
      </Box>
    </Container>
  );
};

export default WalletConnect;

// @flow
import React from "react";
import { Trans } from "react-i18next";
import Box from "~/renderer/components/Box";
import TrackPage from "~/renderer/analytics/TrackPage";
import LedgerLiveImg from "~/renderer/images/ledgerlive-logo.svg";
import LedgerLiveLogo from "~/renderer/components/LedgerLiveLogo";
import Button from "~/renderer/components/Button";
import { Description, Title } from "../sharedComponents";
import type { StepProps } from "..";
import ThemeSelector from "./ThemeSelector";

const Start = (props: StepProps) => {
  const { jumpStep } = props;
  return (
    <Box sticky justifyContent="center">
      <TrackPage category="Onboarding" name="Start" />
      <Box alignItems="center">
        <LedgerLiveLogo
          icon={<img src={LedgerLiveImg} alt="" draggable="false" width={50} height={50} />}
        />
        <Box>
          <Title>
            <Trans i18nKey="onboarding.start.title" />
          </Title>
        </Box>
        <Box>
          <Description>
            <Trans i18nKey="onboarding.start.themeDesc" />
          </Description>
        </Box>
        <ThemeSelector />
        <Button
          primary
          onClick={() => jumpStep("init")}
          data-automation-id="onboarding-get-started-button"
        >
          <Trans i18nKey="onboarding.start.startBtn" />
        </Button>
      </Box>
    </Box>
  );
};
export default Start;

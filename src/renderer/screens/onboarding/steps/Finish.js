// @flow

import React, { Component } from "react";
import styled from "styled-components";
import { urls } from "~/config/urls";
import { getDeviceModel } from "@ledgerhq/devices";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import { Description, Title } from "~/renderer/screens/onboarding/sharedComponents";
import Button from "~/renderer/components/Button";
import { lighten } from "~/renderer/styles/helpers";
import { openURL } from "~/renderer/linking";

import LedgerLiveImg from "~/renderer/images/ledgerlive-logo.svg";
import IconCheckFull from "~/renderer/icons/CheckFull";
import IconSocialTwitter from "~/renderer/icons/Twitter";
import IconSocialReddit from "~/renderer/icons/Reddit";
import IconSocialGithub from "~/renderer/icons/Github";
import ConfettiParty from "~/renderer/components/ConfettiParty";
import LedgerLiveLogo from "~/renderer/components/LedgerLiveLogo";
import Image from "~/renderer/components/Image";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import type { StepProps } from "~/renderer/screens/onboarding";

const ConfettiLayer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
`;

const socialMedia = [
  // FIXME it should just be vdom in place
  {
    key: "twitter",
    url: urls.social.twitter,
    icon: <IconSocialTwitter size={24} />,
    onClick: url => openURL(url),
  },
  {
    key: "github",
    url: urls.social.github,
    icon: <IconSocialGithub size={24} />,
    onClick: url => openURL(url),
  },
  {
    key: "reddit",
    url: urls.social.reddit,
    icon: <IconSocialReddit size={24} />,
    onClick: url => openURL(url),
  },
];

export default class Finish extends Component<StepProps, *> {
  state = { emit: false };
  onMouseUp = () => this.setState({ emit: false });
  onMouseDown = () => {
    this.setState({ emit: true });
  };

  onMouseLeave = () => {
    this.setState({ emit: false });
  };

  render() {
    const { finish, t, onboarding } = this.props;
    const { emit } = this.state;

    const model = getDeviceModel(onboarding.deviceModelId || "nanoS");

    return (
      <Box sticky justifyContent="center">
        <TrackPage
          category="Onboarding"
          name="Finish"
          flowType={onboarding.flowType}
          deviceType={model.productName}
        />
        <ConfettiLayer>
          <ConfettiParty emit={emit} />
        </ConfettiLayer>
        <Box alignItems="center">
          <Box
            style={{ position: "relative" }}
            onMouseDown={this.onMouseDown}
            onMouseUp={this.onMouseUp}
            onMouseLeave={this.onMouseLeave}
          >
            <LedgerLiveLogo
              width="64px"
              height="64px"
              icon={
                <Image resource={LedgerLiveImg} alt="" draggable="false" width={40} height={40} />
              }
            />
            <Box color="positiveGreen" style={{ position: "absolute", right: 0, bottom: 0 }}>
              <IconCheckFull size={18} />
            </Box>
          </Box>

          <Box pt={5} alignItems="center">
            <Title>{t("onboarding.finish.title")}</Title>
            <Description>{t("onboarding.finish.desc")}</Description>
          </Box>
          <Box p={5}>
            <Button primary onClick={() => finish()} id="onboarding-open-button">
              {t("onboarding.finish.openAppButton")}
            </Button>
          </Box>
          <Box horizontal mt={3} flow={5} color="palette.text.shade60">
            {socialMedia.map(socMed => (
              <SocialMediaBox key={socMed.key} socMed={socMed} />
            ))}
          </Box>
        </Box>
      </Box>
    );
  }
}

type SocMed = {
  key: string,
  icon: any,
  url: string,
  onClick: string => void,
};

const StyledBox: ThemedComponent<{}> = styled(Box)`
  cursor: default; // this here needs reset because it inherits from cursor: text from parent
  &:hover {
    color: ${p => lighten(p.theme.colors.palette.text.shade60, 0.1)};
  }
`;

export function SocialMediaBox({ socMed }: { socMed: SocMed }) {
  const { key, icon, url, onClick } = socMed;
  return (
    <StyledBox horizontal onClick={() => onClick(url)} id={`onboarding-${key}-button`}>
      {icon}
    </StyledBox>
  );
}

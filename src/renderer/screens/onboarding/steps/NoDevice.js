// @flow
import React, { PureComponent } from "react";
import { Trans } from "react-i18next";
import { openURL } from "~/renderer/linking";
import { urls } from "~/config/urls";
import IconCart from "~/renderer/icons/Cart";
import IconTruck from "~/renderer/icons/Truck";
import IconInfoCircle from "~/renderer/icons/InfoCircle";
import Box from "~/renderer/components/Box";
import GrowScroll from "~/renderer/components/GrowScroll";
import LedgerLiveLogo from "~/renderer/components/LedgerLiveLogo";
import LedgerLiveImg from "~/renderer/images/ledgerlive-logo.svg";
import TrackPage from "~/renderer/analytics/TrackPage";
import { OptionFlowCard } from "~/renderer/screens/onboarding/steps/Init";
import Button from "~/renderer/components/Button";
import Image from "~/renderer/components/Image";
import { Title, OnboardingFooterWrapper } from "../sharedComponents";
import type { StepProps } from "..";

class NoDevice extends PureComponent<StepProps, *> {
  render() {
    const { t, prevStep } = this.props;

    const optionCards = [
      {
        key: "buyNew",
        icon: <IconCart size={20} />,
        title: t("onboarding.noDevice.buyNew.title"),
        onClick: () => {
          openURL(urls.noDeviceBuyNew);
        },
      },
      {
        key: "trackOrder",
        icon: <IconTruck size={20} />,
        title: t("onboarding.noDevice.trackOrder.title"),
        onClick: () => {
          openURL(urls.noDeviceTrackOrder);
        },
      },
      {
        key: "learnMore",
        icon: <IconInfoCircle size={20} />,
        title: t("onboarding.noDevice.learnMore.title"),
        onClick: () => {
          openURL(urls.noDeviceLearnMore);
        },
      },
    ];

    return (
      <Box sticky>
        <GrowScroll pb={7} pt={130}>
          <TrackPage category="Onboarding" name="No Device" />
          <Box grow alignItems="center">
            <LedgerLiveLogo
              width="64px"
              height="64px"
              icon={
                <Image resource={LedgerLiveImg} alt="" draggable="false" width={40} height={40} />
              }
            />
            <Box m={5} style={{ maxWidth: 480 }}>
              <Title>
                <Trans i18nKey="onboarding.noDevice.title" />
              </Title>
            </Box>
            <Box pt={4} flow={4}>
              {optionCards.map(card => (
                <OptionFlowCard key={card.key} card={card} />
              ))}
            </Box>
          </Box>
        </GrowScroll>
        <OnboardingFooterWrapper>
          <Button outlineGrey onClick={() => prevStep()} mr="auto">
            <Trans i18nKey="common.back" />
          </Button>
        </OnboardingFooterWrapper>
      </Box>
    );
  }
}

export default NoDevice;

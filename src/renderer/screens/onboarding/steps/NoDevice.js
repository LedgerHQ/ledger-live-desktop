// @flow
import React, { PureComponent } from "react";
import { Trans } from "react-i18next";
import { openURL } from "~/renderer/linking";
import { urls } from "~/config/urls";
import IconCart from "~/renderer/icons/Cart";
import IconBook from "~/renderer/icons/Book";
import IconInfoCircle from "~/renderer/icons/InfoCircle";
import Box from "~/renderer/components/Box";
import GrowScroll from "~/renderer/components/GrowScroll";
import LedgerLiveLogo from "~/renderer/components/LedgerLiveLogo";
import LedgerLiveImg from "~/renderer/images/ledgerlive-logo.svg";
import TrackPage from "~/renderer/analytics/TrackPage";
import { OptionFlowCard } from "~/renderer/screens/onboarding/steps/Init";
import Image from "~/renderer/components/Image";
import { Title } from "../sharedComponents";
import type { StepProps } from "..";
import OnboardingFooter from "~/renderer/screens/onboarding/OnboardingFooter";

class NoDevice extends PureComponent<StepProps, *> {
  render() {
    const { t, prevStep } = this.props;

    const optionCards = [
      {
        key: "buyNew",
        icon: <IconCart size={20} />,
        title: t("onboarding.noDevice.buyNew.title"),
        onClick: () => {
          openURL(urls.noDevice.buyNew);
        },
      },
      {
        key: "learnMore",
        icon: <IconInfoCircle size={20} />,
        title: t("onboarding.noDevice.learnMore.title"),
        onClick: () => {
          openURL(urls.noDevice.learnMore);
        },
      },
      {
        key: "learnMoreCrypto",
        icon: <IconBook size={20} />,
        title: t("onboarding.noDevice.learnMoreCrypto.title"),
        onClick: () => {
          openURL(urls.noDevice.learnMoreCrypto);
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
        <OnboardingFooter prevStep={prevStep} />
      </Box>
    );
  }
}

export default NoDevice;

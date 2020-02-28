// @flow
import React, { PureComponent } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { getDeviceModel } from "@ledgerhq/devices";
import { urls } from "~/config/urls";
import { openURL } from "~/renderer/linking";
import Track from "~/renderer/analytics/Track";
import { saveSettings } from "~/renderer/actions/settings";
import { openModal } from "~/renderer/actions/modals";
import TrackPage from "~/renderer/analytics/TrackPage";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Box from "~/renderer/components/Box";
import FakeLink from "~/renderer/components/FakeLink";
import Switch from "~/renderer/components/Switch";
import OnboardingFooter from "../OnboardingFooter";
import { Description, FixedTopContainer, StepContainerInner, Title } from "../sharedComponents";
import type { StepProps } from "..";
import { removeEncryptionKey } from "~/renderer/storage";
import { setHasPassword } from "~/renderer/actions/application";

const mapDispatchToProps = { saveSettings, openModal, setHasPassword };

type State = {
  analyticsToggle: boolean,
  sentryLogsToggle: boolean,
};

const INITIAL_STATE = {
  analyticsToggle: true,
  sentryLogsToggle: true,
};

class Analytics extends PureComponent<StepProps, State> {
  state = INITIAL_STATE;

  handleSentryLogsToggle = (isChecked: boolean) => {
    this.setState({ sentryLogsToggle: !this.state.sentryLogsToggle });
    this.props.saveSettings({
      sentryLogs: isChecked,
    });
  };

  handleAnalyticsToggle = (isChecked: boolean) => {
    this.setState({ analyticsToggle: !this.state.analyticsToggle });
    this.props.saveSettings({
      shareAnalytics: isChecked,
    });
  };

  onClickTerms = () => openURL(urls.terms);
  onClickPrivacy = () => openURL(urls.privacyPolicy);

  handleNavBack = () => {
    const { prevStep, setHasPassword } = this.props;
    removeEncryptionKey("app", "accounts");
    setHasPassword(false);
    prevStep();
  };

  handleShareAnalyticsModal = () => {
    this.props.openModal("MODAL_SHARE_ANALYTICS");
  };

  handleTechnicalDataModal = () => {
    this.props.openModal("MODAL_TECHNICAL_DATA");
  };

  render() {
    const { nextStep, t, onboarding } = this.props;
    const { analyticsToggle, sentryLogsToggle } = this.state;

    const model = getDeviceModel(onboarding.deviceModelId || "nanoS");

    return (
      <FixedTopContainer>
        <TrackPage
          category="Onboarding"
          name="Analytics"
          flowType={onboarding.flowType}
          deviceType={model.productName}
        />
        <StepContainerInner>
          <Title data-e2e="onboarding_title">{t("onboarding.analytics.title")}</Title>
          <Description>{t("onboarding.analytics.desc")}</Description>
          <Box mt={5}>
            <Container>
              <Box>
                <Box horizontal mb={1}>
                  <AnalyticsTitle data-e2e="analytics_techData">
                    {t("onboarding.analytics.technicalData.title")}
                  </AnalyticsTitle>
                  <LearnMoreWrapper>
                    <FakeLink
                      underline
                      fontSize={3}
                      color="palette.text.shade80"
                      ml={2}
                      onClick={this.handleTechnicalDataModal}
                      data-e2e="analytics_techData_Link"
                    >
                      {t("common.learnMore")}
                    </FakeLink>
                  </LearnMoreWrapper>
                </Box>
                <AnalyticsText>{t("onboarding.analytics.technicalData.desc")}</AnalyticsText>
                <MandatoryText>
                  {t("onboarding.analytics.technicalData.mandatoryText")}
                </MandatoryText>
              </Box>
              <Box justifyContent="center">
                <Switch disabled isChecked />
              </Box>
            </Container>
            <Container>
              <Box>
                <Box horizontal mb={1}>
                  <AnalyticsTitle data-e2e="analytics_shareAnalytics">
                    {t("onboarding.analytics.shareAnalytics.title")}
                  </AnalyticsTitle>
                  <LearnMoreWrapper>
                    <FakeLink
                      style={{ textDecoration: "underline" }}
                      fontSize={3}
                      color="palette.text.shade80"
                      ml={2}
                      onClick={this.handleShareAnalyticsModal}
                      data-e2e="analytics_shareAnalytics_Link"
                    >
                      {t("common.learnMore")}
                    </FakeLink>
                  </LearnMoreWrapper>
                </Box>
                <AnalyticsText>{t("onboarding.analytics.shareAnalytics.desc")}</AnalyticsText>
              </Box>
              <Box justifyContent="center">
                <Track
                  onUpdate
                  event={
                    analyticsToggle
                      ? "Analytics Enabled Onboarding"
                      : "Analytics Disabled Onboarding"
                  }
                />
                <Switch isChecked={analyticsToggle} onChange={this.handleAnalyticsToggle} />
              </Box>
            </Container>
            <Container>
              <Box>
                <Box mb={1}>
                  <AnalyticsTitle data-e2e="analytics_reportBugs">
                    {t("onboarding.analytics.sentryLogs.title")}
                  </AnalyticsTitle>
                </Box>
                <AnalyticsText>{t("onboarding.analytics.sentryLogs.desc")}</AnalyticsText>
              </Box>
              <Box justifyContent="center">
                <Track
                  onUpdate
                  event={
                    sentryLogsToggle
                      ? "Sentry Logs Enabled Onboarding"
                      : "Sentry Logs Disabled Onboarding"
                  }
                />
                <Switch isChecked={sentryLogsToggle} onChange={this.handleSentryLogsToggle} />
              </Box>
            </Container>
          </Box>
        </StepContainerInner>
        <OnboardingFooter
          horizontal
          alignItems="center"
          flow={2}
          t={t}
          nextStep={nextStep}
          prevStep={this.handleNavBack}
        />
      </FixedTopContainer>
    );
  }
}

const ConnectedAnalytics: React$ComponentType<StepProps> = connect(
  null,
  mapDispatchToProps,
)(Analytics);

export default ConnectedAnalytics;

const MandatoryText: ThemedComponent<{}> = styled(Box).attrs(() => ({
  ff: "Inter|Regular",
  fontSize: 2,
  textAlign: "left",
  color: "palette.text.shade60",
  mt: 1,
}))``;

export const AnalyticsText: ThemedComponent<{}> = styled(Box).attrs(() => ({
  ff: "Inter|Regular",
  fontSize: 3,
  textAlign: "left",
  color: "palette.text.shade80",
}))`
  max-width: 400px;
`;

export const AnalyticsTitle: ThemedComponent<{}> = styled(Box).attrs(() => ({
  ff: "Inter|SemiBold",
  fontSize: 4,
  textAlign: "left",
  color: "palette.text.shade100",
}))``;

const Container: ThemedComponent<{}> = styled(Box).attrs(() => ({
  horizontal: true,
  p: 3,
}))`
  width: 550px;
  justify-content: space-between;
`;

const LearnMoreWrapper = styled(Box)`
  ${FakeLink}:hover {
    color: ${p => p.theme.colors.wallet};
  }
`;

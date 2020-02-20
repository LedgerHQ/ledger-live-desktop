// @flow

import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { getDeviceModel } from "@ledgerhq/devices";
import { setEncryptionKey } from "~/renderer/storage";
import IconChevronRight from "~/renderer/icons/ChevronRight";
import {
  Description,
  DisclaimerBox,
  FixedTopContainer,
  OnboardingFooterWrapper,
  StepContainerInner,
  Title,
} from "~/renderer/screens/onboarding/sharedComponents";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import PasswordForm from "~/renderer/modals/PasswordModal/PasswordForm";
import Button from "~/renderer/components/Button";
import { withTheme } from "styled-components";
import type { StepProps } from "~/renderer/screens/onboarding";
import { setHasPassword } from "~/renderer/actions/application";
import { hasPasswordSelector } from "~/renderer/reducers/application";
import { createStructuredSelector } from "reselect";

type State = {
  currentPassword: string,
  newPassword: string,
  confirmPassword: string,
};

const mapDispatchToProps = {
  setHasPassword,
};

const mapStateToProps = createStructuredSelector({
  hasPasswordSelector,
});

const INITIAL_STATE = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

type Props = StepProps & {
  hasPassword: boolean,
  setHasPassword: boolean => void,
  theme: any,
};

class SetPassword extends PureComponent<Props, State> {
  state = INITIAL_STATE;

  handleSave = async (e: SyntheticEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }
    if (!this.isValid()) {
      return;
    }
    const { newPassword } = this.state;
    const { nextStep, setHasPassword } = this.props;

    await setEncryptionKey("app", "accounts", newPassword);
    setHasPassword(true);
    this.handleReset();
    nextStep();
  };

  handleInputChange = (key: string) => (value: string) => {
    this.setState({ [key]: value });
  };

  handleReset = () => this.setState(INITIAL_STATE);

  isValid = () => {
    const { newPassword, confirmPassword } = this.state;
    return newPassword === confirmPassword;
  };

  render() {
    const { nextStep, prevStep, t, onboarding, theme, hasPassword } = this.props;
    const { newPassword, currentPassword, confirmPassword } = this.state;

    const disclaimerNotes = [
      {
        key: "note1",
        icon: <IconChevronRight size={12} style={{ color: theme.colors.palette.text.shade80 }} />,
        desc: t("onboarding.setPassword.disclaimer.note1"),
      },
      {
        key: "note2",
        icon: <IconChevronRight size={12} style={{ color: theme.colors.palette.text.shade80 }} />,
        desc: t("onboarding.setPassword.disclaimer.note2"),
      },
      {
        key: "note3",
        icon: <IconChevronRight size={12} style={{ color: theme.colors.palette.text.shade80 }} />,
        desc: t("onboarding.setPassword.disclaimer.note3"),
      },
    ];

    return (
      <FixedTopContainer>
        <TrackPage
          category="Onboarding"
          name="Set Password"
          flowType={onboarding.flowType}
          deviceType={getDeviceModel(onboarding.deviceModelId || "nanoS").productName}
        />
        <StepContainerInner>
          <>
            <Box alignItems="center">
              <Title>{t("onboarding.setPassword.title")}</Title>
              <Description style={{ maxWidth: 620 }}>
                {t("onboarding.setPassword.desc")}
              </Description>
            </Box>
            <Box alignItems="center" mt={2}>
              <PasswordForm
                onSubmit={this.handleSave}
                hasPassword={hasPassword}
                newPassword={newPassword}
                currentPassword={currentPassword}
                confirmPassword={confirmPassword}
                isValid={this.isValid}
                onChange={this.handleInputChange}
                t={t}
              />

              <DisclaimerBox mt={7} disclaimerNotes={disclaimerNotes} />
            </Box>
          </>
        </StepContainerInner>

        <OnboardingFooterWrapper>
          <Button outlineGrey onClick={() => prevStep()}>
            {t("common.back")}
          </Button>
          <Box horizontal ml="auto">
            <Button
              event="Onboarding Skip Password"
              onClick={() => nextStep()}
              disabled={false}
              mx={2}
            >
              {t("common.skipThisStep")}
            </Button>
            <Button
              onClick={this.handleSave}
              disabled={!this.isValid() || !newPassword.length || !confirmPassword.length}
              primary
            >
              {t("common.continue")}
            </Button>
          </Box>
        </OnboardingFooterWrapper>
      </FixedTopContainer>
    );
  }
}

const ConnectedSetPassword: React$ComponentType<{}> = withTheme(
  connect(mapStateToProps, mapDispatchToProps)(SetPassword),
);
export default ConnectedSetPassword;

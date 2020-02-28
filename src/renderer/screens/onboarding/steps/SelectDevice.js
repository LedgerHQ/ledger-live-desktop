// @flow
import React, { PureComponent } from "react";
import { Trans } from "react-i18next";
import styled from "styled-components";
import type { DeviceModelId } from "@ledgerhq/devices";
import { getDeviceModel } from "@ledgerhq/devices";
import { connect } from "react-redux";
import TrackPage from "~/renderer/analytics/TrackPage";
import Track from "~/renderer/analytics/Track";
import { rgba } from "~/renderer/styles/helpers";
import { deviceModelId } from "~/renderer/actions/onboarding";
import Tooltip from "~/renderer/components/Tooltip";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import Box from "~/renderer/components/Box";
import InvertableImg from "~/renderer/components/InvertableImg";
import IconCheckCircle from "~/renderer/icons/Check";
import OnboardingFooter from "~/renderer/screens/onboarding/OnboardingFooter";
import LedgerBlue from "~/renderer/images/ledger-blue-onb.svg";
import LedgerNanoS from "~/renderer/images/ledger-nano-s-onb.svg";
import LedgerNanoX from "~/renderer/images/ledger-nano-x-onb.svg";
import { FixedTopContainer, Inner, StepContainerInner, Title } from "../sharedComponents";
import type { StepProps } from "..";

const mapDispatchToProps = { deviceModelId };

class SelectDeviceC extends PureComponent<StepProps, {}> {
  handleDeviceModelId = (deviceModelId: DeviceModelId) => {
    this.props.deviceModelId(deviceModelId);
  };

  handleContinue = () => {
    const { nextStep, jumpStep, onboarding } = this.props;
    if (onboarding.flowType === "initializedDevice") {
      jumpStep("genuineCheck");
    } else {
      nextStep();
    }
  };

  render() {
    const { t, onboarding, jumpStep } = this.props;
    return (
      <FixedTopContainer>
        <TrackPage category="Onboarding" name="Select Device" flowType={onboarding.flowType} />
        <StepContainerInner>
          <Box mb={5}>
            <Title>{t("onboarding.selectDevice.title")}</Title>
          </Box>
          <Track event="SelectDevice" onUpdate deviceModelId={onboarding.deviceModelId} />
          <Box pt={4}>
            <Inner>
              <DeviceContainer
                isActive={onboarding.deviceModelId === "nanoX"}
                onClick={() => this.handleDeviceModelId("nanoX")}
              >
                {onboarding.deviceModelId === "nanoX" && <DeviceSelected />}
                <DeviceIcon>
                  <InvertableImg alt="" src={LedgerNanoX} />
                </DeviceIcon>
                <BlockTitle>{getDeviceModel("nanoX").productName}</BlockTitle>
                <Tooltip content={<Trans i18nKey="onboarding.selectDevice.usbOnlyTooltip" />}>
                  <USBOnly>
                    <Trans i18nKey="onboarding.selectDevice.usbOnly" />
                  </USBOnly>
                </Tooltip>
              </DeviceContainer>
              <DeviceContainer
                isActive={onboarding.deviceModelId === "nanoS"}
                onClick={() => this.handleDeviceModelId("nanoS")}
              >
                {onboarding.deviceModelId === "nanoS" && <DeviceSelected />}
                <DeviceIcon>
                  <InvertableImg alt="" src={LedgerNanoS} />
                </DeviceIcon>
                <BlockTitle>{getDeviceModel("nanoS").productName}</BlockTitle>
              </DeviceContainer>
              <DeviceContainer
                isActive={onboarding.deviceModelId === "blue"}
                onClick={() => this.handleDeviceModelId("blue")}
              >
                {onboarding.deviceModelId === "blue" && <DeviceSelected />}
                <DeviceIcon>
                  <InvertableImg alt="" src={LedgerBlue} />
                </DeviceIcon>
                <BlockTitle>{getDeviceModel("blue").productName}</BlockTitle>
              </DeviceContainer>
            </Inner>
          </Box>
        </StepContainerInner>
        <OnboardingFooter
          horizontal
          t={t}
          nextStep={this.handleContinue}
          prevStep={() => jumpStep("init")}
          isContinueDisabled={!onboarding.deviceModelId}
        />
      </FixedTopContainer>
    );
  }
}

const SelectDevice: React$ComponentType<StepProps> = connect(
  null,
  mapDispatchToProps,
)(SelectDeviceC);

export default SelectDevice;

const DeviceContainer = styled(Box).attrs(() => ({
  alignItems: "center",
  justifyContent: "center",
  relative: true,
  borderRadius: "4px",
}))`
  width: 218px;
  height: 204px;
  border: ${p =>
    `1px solid ${
      p.isActive ? p.theme.colors.palette.primary.main : p.theme.colors.palette.divider
    }`};
  &:hover {
    /* this here needs reset because it inherits from cursor: text from parent */
    cursor: default;
    background: ${p => rgba(p.theme.colors.wallet, 0.04)};
  }
`;
const DeviceIcon = styled(Box).attrs(() => ({
  alignItems: "center",
  justifyContent: "center",
}))`
  width: 55px;
  height: 80px;
`;

export const BlockTitle: ThemedComponent<{}> = styled(Box).attrs(() => ({
  ff: "Inter|SemiBold",
  fontSize: 4,
  textAlign: "center",
  pt: 3,
  color: "palette.text.shade100",
}))``;
export function DeviceSelected() {
  return (
    <SelectDeviceIconWrapper
      style={{
        position: "absolute",
        top: "10px",
        right: "10px",
      }}
    >
      <IconCheckCircle size={10} />
    </SelectDeviceIconWrapper>
  );
}

const SelectDeviceIconWrapper: ThemedComponent<{}> = styled(Box).attrs(() => ({
  alignItems: "center",
  justifyContent: "center",
  color: "palette.background.paper",
  bg: "wallet",
}))`
  border-radius: 50%;
  width: 18px;
  height: 18px;
`;

const USBOnly = styled(Box).attrs(() => ({
  alignItems: "center",
  justifyContent: "center",
  ff: "Inter|Bold",
  fontSize: 0,
  borderRadius: "2px",
}))`
  position: absolute;
  bottom: 20px;
  color: ${p => p.theme.colors.palette.primary.contrastText};
  background-color: ${p => p.theme.colors.palette.text.shade40};
  line-height: 16px;
  padding: 0 4px;
  text-transform: uppercase;
  transform: translateX(-50%);
`;

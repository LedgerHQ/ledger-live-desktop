// @flow
import React from "react";
import { getDeviceModel } from "@ledgerhq/devices";
import TrackPage from "~/renderer/analytics/TrackPage";
import GrowScroll from "~/renderer/components/GrowScroll";
import Box from "~/renderer/components/Box";
import OnboardingFooter from "~/renderer/screens/onboarding/OnboardingFooter";
import SelectPINblue from "~/renderer/screens/onboarding/steps/SelectPIN/SelectPINblue";
import SelectPINRestoreNanoX from "~/renderer/screens/onboarding/steps/SelectPIN/SelectPINRestoreNanoX";
import SelectPINrestoreBlue from "~/renderer/screens/onboarding/steps/SelectPIN/SelectPINrestoreBlue";
import SelectPINnano from "~/renderer/screens/onboarding/steps/SelectPIN/SelectPINnano";
import SelectPINrestoreNano from "~/renderer/screens/onboarding/steps/SelectPIN/SelectPINrestoreNano";
import SelectPINnanoX from "~/renderer/screens/onboarding/steps/SelectPIN/SelectPINnanoX";
import IconSensitiveOperationShield from "~/renderer/icons/SensitiveOperationShield";
import {
  DisclaimerBoxContainer,
  DisclaimerBoxIconContainer,
  FixedTopContainer,
  Title,
} from "~/renderer/screens/onboarding/sharedComponents";
import type { StepProps } from "~/renderer/screens/onboarding";
import type { DeviceModelId } from "@ledgerhq/devices/lib";
import OptionRow from "~/renderer/components/OptionRow";

const SelectPin = ({ modelId, restore = false }: { modelId: DeviceModelId, restore?: boolean }) => {
  switch (modelId) {
    case "nanoX":
      return restore ? <SelectPINRestoreNanoX /> : <SelectPINnanoX />;
    case "blue":
      return restore ? <SelectPINrestoreBlue /> : <SelectPINblue />;
    default:
      return restore ? <SelectPINrestoreNano /> : <SelectPINnano />;
  }
};

const SelectPinMain = (props: StepProps) => {
  const { nextStep, prevStep, t, onboarding } = props;

  const model = getDeviceModel(onboarding.deviceModelId || "nanoS");

  return (
    <FixedTopContainer>
      <GrowScroll pb={7}>
        <TrackPage
          category="Onboarding"
          name="Choose PIN"
          flowType={onboarding.flowType}
          deviceType={model.productName}
        />
        {onboarding.flowType === "restoreDevice" ? (
          <Box grow alignItems="center">
            <Title>{t("onboarding.selectPIN.restore.title")}</Title>
            <Box alignItems="center" mt={7}>
              <SelectPin modelId={model.id} restore />
            </Box>
          </Box>
        ) : (
          <Box grow alignItems="center">
            <Title>{t("onboarding.selectPIN.initialize.title")}</Title>
            <Box alignItems="center" mt={7}>
              <SelectPin modelId={model.id} />
            </Box>
          </Box>
        )}
      </GrowScroll>
      <OnboardingFooter horizontal flow={2} t={t} nextStep={nextStep} prevStep={prevStep} />
    </FixedTopContainer>
  );
};

export default SelectPinMain;

export function DisclaimerBox({ disclaimerNotes, ...p }: { disclaimerNotes: any }) {
  return (
    <DisclaimerBoxContainer {...p}>
      <Box m={3} relative>
        <DisclaimerBoxIconContainer>
          <IconSensitiveOperationShield />
        </DisclaimerBoxIconContainer>
        {disclaimerNotes.map(note => (
          <OptionRow justify="center" key={note.key} step={note} />
        ))}
      </Box>
    </DisclaimerBoxContainer>
  );
}

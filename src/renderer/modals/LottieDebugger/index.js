// @flow
import React, { useMemo, useState } from "react";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import styled from "styled-components";
import { Trans } from "react-i18next";
import Button from "~/renderer/components/Button";
import Animation from "~/renderer/animations";
import Alert from "~/renderer/components/Alert";
import Box from "~/renderer/components/Box";
import Modal, { ModalBody } from "~/renderer/components/Modal";
import Select from "~/renderer/components/Select";
import { getDeviceAnimation } from "~/renderer/components/DeviceAction/animations";
import type { DeviceModelId } from "@ledgerhq/devices";

// All animations used on onboarding
import NanoSConfirmWordsLight from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoS/confirmWords/light.json";
import NanoSConfirmWordsDark from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoS/confirmWords/dark.json";
import NanoSNumberOfWordsLight from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoS/numberOfWords/light.json";
import NanoSNumberOfWordsDark from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoS/numberOfWords/dark.json";
import NanoSPinCodeLight from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoS/pinCode/light.json";
import NanoSPinCodeDark from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoS/pinCode/dark.json";
import NanoSPowerOnRecoveryLight from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoS/powerOnRecovery/light.json";
import NanoSPowerOnRecoveryDark from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoS/powerOnRecovery/dark.json";
import NanoSPowerOnLight from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoS/powerOn/light.json";
import NanoSPowerOnDark from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoS/powerOn/dark.json";
import NanoSRecoverLight from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoS/recover/light.json";
import NanoSRecoverDark from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoS/recover/dark.json";
import NanoSPlugDeviceLight from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoS/plugDevice/light.json";
import NanoSPlugDeviceDark from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoS/plugDevice/dark.json";

import NanoSPConfirmWordsLight from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoSP/confirmWords/light.json";
import NanoSPConfirmWordsDark from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoSP/confirmWords/dark.json";
import NanoSPNumberOfWordsLight from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoSP/numberOfWords/light.json";
import NanoSPNumberOfWordsDark from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoSP/numberOfWords/dark.json";
import NanoSPPinCodeLight from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoSP/pinCode/light.json";
import NanoSPPinCodeDark from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoSP/pinCode/dark.json";
import NanoSPPowerOnRecoveryLight from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoSP/powerOnRecovery/light.json";
import NanoSPPowerOnRecoveryDark from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoSP/powerOnRecovery/dark.json";
import NanoSPPowerOnLight from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoSP/powerOn/light.json";
import NanoSPPowerOnDark from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoSP/powerOn/dark.json";
import NanoSPRecoverLight from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoSP/recover/light.json";
import NanoSPRecoverDark from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoSP/recover/dark.json";
import NanoSPPlugDeviceLight from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoSP/plugDevice/light.json";
import NanoSPPlugDeviceDark from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoSP/plugDevice/dark.json";

import NanoXConfirmWordsLight from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoX/confirmWords/light.json";
import NanoXConfirmWordsDark from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoX/confirmWords/dark.json";
import NanoXNumberOfWordsLight from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoX/numberOfWords/light.json";
import NanoXNumberOfWordsDark from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoX/numberOfWords/dark.json";
import NanoXPinCodeLight from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoX/pinCode/light.json";
import NanoXPinCodeDark from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoX/pinCode/dark.json";
import NanoXPowerOnRecoveryLight from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoX/powerOnRecovery/light.json";
import NanoXPowerOnRecoveryDark from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoX/powerOnRecovery/dark.json";
import NanoXPowerOnLight from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoX/powerOn/light.json";
import NanoXPowerOnDark from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoX/powerOn/dark.json";
import NanoXRecoverLight from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoX/recover/light.json";
import NanoXRecoverDark from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoX/recover/dark.json";
import NanoXPlugDeviceLight from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoX/plugDevice/light.json";
import NanoXPlugDeviceDark from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoX/plugDevice/dark.json";

const AnimationWrapper: ThemedComponent<{ modelId?: DeviceModelId }> = styled.div`
  width: 600px;
  max-width: 100%;
  padding-bottom: 0px;
  align-self: center;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${p => (p.dark ? "#000" : "#fff")};
`;

export const lottieAnimations = {
  nanoS: {
    confirmWords: {
      light: NanoSConfirmWordsLight,
      dark: NanoSConfirmWordsDark,
    },
    numberOfWords: {
      light: NanoSNumberOfWordsLight,
      dark: NanoSNumberOfWordsDark,
    },
    pinCode: {
      light: NanoSPinCodeLight,
      dark: NanoSPinCodeDark,
    },
    powerOnRecovery: {
      light: NanoSPowerOnRecoveryLight,
      dark: NanoSPowerOnRecoveryDark,
    },
    powerOn: {
      light: NanoSPowerOnLight,
      dark: NanoSPowerOnDark,
    },
    recover: {
      light: NanoSRecoverLight,
      dark: NanoSRecoverDark,
    },
    plugDevice: {
      light: NanoSPlugDeviceLight,
      dark: NanoSPlugDeviceDark,
    },
  },
  nanoSP: {
    confirmWords: {
      light: NanoSPConfirmWordsLight,
      dark: NanoSPConfirmWordsDark,
    },
    numberOfWords: {
      light: NanoSPNumberOfWordsLight,
      dark: NanoSPNumberOfWordsDark,
    },
    pinCode: {
      light: NanoSPPinCodeLight,
      dark: NanoSPPinCodeDark,
    },
    powerOnRecovery: {
      light: NanoSPPowerOnRecoveryLight,
      dark: NanoSPPowerOnRecoveryDark,
    },
    powerOn: {
      light: NanoSPPowerOnLight,
      dark: NanoSPPowerOnDark,
    },
    recover: {
      light: NanoSPRecoverLight,
      dark: NanoSPRecoverDark,
    },
    plugDevice: {
      light: NanoSPPlugDeviceLight,
      dark: NanoSPPlugDeviceDark,
    },
  },
  nanoX: {
    confirmWords: {
      light: NanoXConfirmWordsLight,
      dark: NanoXConfirmWordsDark,
    },
    numberOfWords: {
      light: NanoXNumberOfWordsLight,
      dark: NanoXNumberOfWordsDark,
    },
    pinCode: {
      light: NanoXPinCodeLight,
      dark: NanoXPinCodeDark,
    },
    powerOnRecovery: {
      light: NanoXPowerOnRecoveryLight,
      dark: NanoXPowerOnRecoveryDark,
    },
    powerOn: {
      light: NanoXPowerOnLight,
      dark: NanoXPowerOnDark,
    },
    recover: {
      light: NanoXRecoverLight,
      dark: NanoXRecoverDark,
    },
    plugDevice: {
      light: NanoXPlugDeviceLight,
      dark: NanoXPlugDeviceDark,
    },
  },
};

const LottieDebugger = ({ name }: { name: string }) => {
  const keys = useMemo(
    () => [
      "plugAndPinCode",
      "enterPinCode",
      "quitApp",
      "allowManager",
      "openApp",
      "validate",
      "installLoading",
      "firmwareUpdating",
    ],
    [],
  );
  const onBoardingKeys = useMemo(
    () => [
      "pinCode",
      "recover",
      "confirmWords",
      "numberOfWords",
      "powerOn",
      "powerOnRecovery",
      "plugDevice",
    ],
    [],
  );

  const [modelId, setModelId] = useState<any>("nanoS");
  const [key, setKey] = useState<any>("enterPinCode");

  const allKeys = [...keys, ...onBoardingKeys];

  const animation = useMemo(() => {
    if (keys.includes(key)) {
      // Normal deviceAction animations
      return getDeviceAnimation(modelId, "light", key);
    }
    if (onBoardingKeys.includes(key) && modelId !== "blue") {
      return lottieAnimations[modelId][key].light;
    }
    return null;
    // Onboarding animations
  }, [key, keys, modelId, onBoardingKeys]);

  const animation2 = useMemo(() => {
    if (keys.includes(key)) {
      // Normal deviceAction animations
      return getDeviceAnimation(modelId, "dark", key);
    }
    if (onBoardingKeys.includes(key) && modelId !== "blue") {
      return lottieAnimations[modelId][key].dark;
    }
    return null;
    // Onboarding animations
  }, [key, keys, modelId, onBoardingKeys]);

  return (
    <Modal
      name={name}
      centered
      render={() => (
        <ModalBody
          onBack={undefined}
          title={<Trans i18nKey="tron.manage.title" />}
          noScroll
          render={() => (
            <>
              <Alert type="warning">
                {
                  "This is a tool provided as-is for the team to validate lottie animations used in the app."
                }
              </Alert>
              <div>{!key ? "Select Animation" : `Showing '${key}' for ${modelId}`}</div>
              <AnimationWrapper>
                <Animation animation={animation} />
              </AnimationWrapper>
              <AnimationWrapper dark>
                <Animation animation={animation2} />
              </AnimationWrapper>
              <Box mt={2} mb={2} horizontal>
                <Button
                  mr={2}
                  primary
                  onClick={() => {
                    setModelId("nanoS");
                  }}
                >
                  Nano S
                </Button>
                <Button
                  mr={2}
                  primary
                  onClick={() => {
                    setModelId("nanoSP");
                  }}
                >
                  Nano S Plus
                </Button>
                <Button
                  primary
                  onClick={() => {
                    setModelId("nanoX");
                  }}
                >
                  Nano X
                </Button>
              </Box>
              <Box>
                <Select
                  isSearchable={false}
                  onChange={({ value }) => {
                    setModelId("nanoS");
                    setKey(value);
                  }}
                  value={key}
                  options={allKeys.map(k => ({ label: k, value: k }))}
                  renderOption={({ label }) => label}
                  renderValue={({ data: { label } }) => label}
                />
              </Box>
            </>
          )}
        />
      )}
    />
  );
};

export default LottieDebugger;

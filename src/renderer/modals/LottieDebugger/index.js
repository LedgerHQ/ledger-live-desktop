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
import NanoSConfirmWords from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoS/confirm-words.json";
import NanoSNumberOfWords from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoS/number-of-words.json";
import NanoSPinCode from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoS/pin-code.json";
import NanoSPowerOnRecovery from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoS/power-on-recovery.json";
import NanoSPowerOn from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoS/power-on.json";
import NanoSRecover from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoS/recover.json";

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

import NanoXConfirmWords from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoX/confirm-words.json";
import NanoXNumberOfWords from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoX/number-of-words.json";
import NanoXPinCode from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoX/pin-code.json";
import NanoXPowerOnRecovery from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoX/power-on-recovery.json";
import NanoXPowerOn from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoX/power-on.json";
import NanoXRecover from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoX/recover.json";

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
      light: NanoSConfirmWords,
      dark: NanoSConfirmWords,
    },
    numberOfWords: {
      light: NanoSNumberOfWords,
      dark: NanoSNumberOfWords,
    },
    pinCode: {
      light: NanoSPinCode,
      dark: NanoSPinCode,
    },
    powerOnRecovery: {
      light: NanoSPowerOnRecovery,
      dark: NanoSPowerOnRecovery,
    },
    powerOn: {
      light: NanoSPowerOn,
      dark: NanoSPowerOn,
    },
    recover: {
      light: NanoSRecover,
      dark: NanoSRecover,
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
  },
  nanoX: {
    confirmWords: {
      light: NanoXConfirmWords,
      dark: NanoXConfirmWords,
    },
    numberOfWords: {
      light: NanoXNumberOfWords,
      dark: NanoXNumberOfWords,
    },
    pinCode: {
      light: NanoXPinCode,
      dark: NanoXPinCode,
    },
    powerOnRecovery: {
      light: NanoXPowerOnRecovery,
      dark: NanoXPowerOnRecovery,
    },
    powerOn: {
      light: NanoXPowerOn,
      dark: NanoXPowerOn,
    },
    recover: {
      light: NanoXRecover,
      dark: NanoXRecover,
    },
  },
};

const LottieDebugger = ({ name }: { name: string }) => {
  const keys = useMemo(
    () => ["plugAndPinCode", "enterPinCode", "quitApp", "allowManager", "openApp", "validate"],
    [],
  );
  const onBoardingKeys = useMemo(
    () => ["pinCode", "recover", "confirmWords", "numberOfWords", "powerOn", "powerOnRecovery"],
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
                  onChange={({ value }) => setKey(value)}
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

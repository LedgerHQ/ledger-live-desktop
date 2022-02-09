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

import NanoSPConfirmWords from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoSP/confirm-words.json";
import NanoSPNumberOfWords from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoSP/number-of-words.json";
import NanoSPPinCode from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoSP/pin-code.json";
import NanoSPPowerOnRecovery from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoSP/power-on-recovery.json";
import NanoSPPowerOn from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoSP/power-on.json";
import NanoSPRecover from "~/renderer/components/Onboarding/Screens/Tutorial/assets/animations/nanoSP/recover.json";

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
    confirmWords: NanoSConfirmWords,
    numberOfWords: NanoSNumberOfWords,
    pinCode: NanoSPinCode,
    powerOnRecovery: NanoSPowerOnRecovery,
    powerOn: NanoSPowerOn,
    recover: NanoSRecover,
  },
  nanoSP: {
    confirmWords: NanoSPConfirmWords,
    numberOfWords: NanoSPNumberOfWords,
    pinCode: NanoSPPinCode,
    powerOnRecovery: NanoSPPowerOnRecovery,
    powerOn: NanoSPPowerOn,
    recover: NanoSPRecover,
  },
  nanoX: {
    confirmWords: NanoXConfirmWords,
    numberOfWords: NanoXNumberOfWords,
    pinCode: NanoXPinCode,
    powerOnRecovery: NanoXPowerOnRecovery,
    powerOn: NanoXPowerOn,
    recover: NanoXRecover,
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
      return lottieAnimations[modelId][key];
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
      return lottieAnimations[modelId][key];
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

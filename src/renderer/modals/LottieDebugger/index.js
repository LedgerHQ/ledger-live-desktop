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
import { getDeviceAnimation } from "~/renderer/components/DeviceAction/animations";

const AnimationWrapper: ThemedComponent<{ modelId?: DeviceModelId }> = styled.div`
  width: 600px;
  max-width: 100%;
  height: ${p => (p.modelId === "blue" ? 300 : 200)}px;
  padding-bottom: ${p => (p.modelId === "blue" ? 20 : 0)}px;
  align-self: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LottieDebugger = ({ name }: { name: string }) => {
  const keys = useMemo(
    () => ["plugAndPinCode", "enterPinCode", "quitApp", "allowManager", "openApp", "validate"],
    [],
  );
  const onBoardingKeys = useMemo(
    () => ["pinCode", "recover", "confirmWords", "numberOfWords", "powerOn", "powerOnRecovery"],
    [],
  );

  const [modelId, setModelId] = useState("nanoX");
  const [key, setKey] = useState("enterPinCode");

  const allKeys = [...keys, ...onBoardingKeys];
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
                <Animation animation={getDeviceAnimation(modelId, "light", key)} />
              </AnimationWrapper>
              <Box horizontal justifyContent="space-around">
                <Button
                  primary
                  onClick={() => {
                    setModelId("nanoS");
                  }}
                >
                  Nano S
                </Button>
                <Button
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
                <Button
                  primary
                  onClick={() => {
                    setModelId("blue");
                  }}
                >
                  Nano Blue
                </Button>
              </Box>
              <Box>
                <div>
                  {allKeys.map((_key, i) => (
                    <div
                      key={_key + i}
                      onClick={() => {
                        setKey(_key);
                      }}
                    >
                      <div>{_key}</div>
                      {/* {key === _key && <Check size={16} color={colors.live} />} */}
                    </div>
                  ))}
                </div>
              </Box>
            </>
          )}
        />
      )}
    />
  );
};

export default LottieDebugger;

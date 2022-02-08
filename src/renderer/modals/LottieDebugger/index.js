import React, { useMemo, useState } from "react";
import Button from "~/renderer/components/Button";
import Animation from "~/renderer/animations";
import Alert from "~/renderer/components/Alert";

const LottieDebugger = () => {
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
  const [keyModalVisible, setKeyModalVisible] = useState(false);
  const animation = useMemo(() => {
    if (keys.includes(key)) {
      // Normal deviceAction animations
      // return getDeviceAnimation({
      return {
        device: { modelId },
        key,
      };
    }
    if (onBoardingKeys.includes(key)) {
      return {}
      // return lottieAnimations[modelId][key];
    }
    return null;
    // Onboarding animations
  }, [key, keys, modelId, onBoardingKeys]);

  const allKeys = [...keys, ...onBoardingKeys];
  return (
    <div>
      <Alert type="warning">
        {
          "This is a tool provided as-is for the team to validate lottie animations used in the app."
        }
      </Alert>
      <div>{!key ? "Select Animation" : `Showing '${key}'`}</div>
      <div>
        <Animation source={animation} />
      </div>
      <div>
        <Button
          type="primary"
          title="nanoS"
          onClick={() => {
            setModelId("nanoS");
          }}
        />
        <Button
          type="primary"
          title="nanoSP"
          onClick={() => {
            setModelId("nanoSP");
          }}
        />
        <Button
          type="primary"
          title="nanoX"
          onClick={() => {
            setModelId("nanoX");
          }}
        />
        <Button
          type="primary"
          title="blue"
          onClick={() => {
            setModelId("blue");
          }}
        />
      </div>
      <div isOpened={keyModalVisible}>
        <div>
          {allKeys.map((_key, i) => (
            <div
              key={_key + i}
              onClick={() => {
                setKey(_key);
                setKeyModalVisible(false);
              }}
            >
              <div>{_key}</div>
              {/* {key === _key && <Check size={16} color={colors.live} />} */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LottieDebugger;

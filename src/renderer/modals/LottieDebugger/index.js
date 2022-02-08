import { divide } from "lodash";
import React, { useMemo, useState } from "react";
import Button from "~/renderer/components/Button";
import Animation from "~/renderer/animations";
import Alert from "./Alert";

const LottieDebugger = () => {
  const keys = useMemo(
    () => [
      "plugAndPinCode",
      "enterPinCode",
      "quitApp",
      "allowManager",
      "openApp",
      "validate",
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
    ],
    [],
  );

  const [modelId, setModelId] = useState("nanoX");
  const [wired, setWired] = useState(false);
  const [key, setKey] = useState<any>("enterPinCode");
  const [keyModalVisible, setKeyModalVisible] = useState(false);
  const animation = useMemo(() => {
    if (keys.includes(key)) {
      // Normal deviceAction animations
      return getDeviceAnimation({
        device: { modelId, wired: wired && modelId === "nanoX" },
        key,
      });
    }
    if (onBoardingKeys.includes(key)) {
      return lottieAnimations[modelId][key];
    }
    return null;
    // Onboarding animations
  }, [key, keys, modelId, onBoardingKeys, wired]);

  const allKeys = [...keys, ...onBoardingKeys];
  return (
    <div
      forceInset={forceInset}
      style={[styles.root, { backgroundColor: colors.background }]}
    >
      <Alert type="warning">
        {
          "This is a tool provided as-is for the team to validate lottie animations used in the app."
        }
      </Alert>
      <div secondary semiBold style={styles.title}>
        {!key ? "Select Animation" : `Showing '${key}'`}
      </div>
      <div>
        <Animation source={animation} />
      </div>
      <div style={styles.select}>
        <Button
          type="primary"
          title="nanoS"
          disabled={Config.OVERRIDE_MODEL_ID}
          onPress={() => {
            setModelId("nanoS");
          }}
        />
        <Button
          type="primary"
          title="nanoSP"
          disabled={Config.OVERRIDE_MODEL_ID}
          onPress={() => {
            setModelId("nanoSP");
          }}
        />
        <Button
          type="primary"
          title="nanoX"
          disabled={Config.OVERRIDE_MODEL_ID}
          onPress={() => {
            setModelId("nanoX");
          }}
        />
        <Button
          type="primary"
          title="blue"
          disabled={Config.OVERRIDE_MODEL_ID}
          onPress={() => {
            setModelId("blue");
          }}
        />
      </div>
      <div isOpened={keyModalVisible} onClose={setKeyModalVisible}>
        <divide style={styles.modal}>
          {allKeys.map((_key, i) => (
            <div
              key={_key + i}
              onPress={() => {
                setKey(_key);
                setKeyModalVisible(false);
              }}
              style={[styles.button]}
            >
              <div
                {...(key === _key ? { semiBold: true } : {})}
                style={[styles.buttonLabel]}
              >
                {_key}
              </div>
              {/* {key === _key && <Check size={16} color={colors.live} />} */}
            </div>
          ))}
        </divide>
      </div>
    </div>
  );
};

export default LottieDebugger;
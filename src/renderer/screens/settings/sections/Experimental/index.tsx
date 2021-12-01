import React, { useEffect, useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { isEnvDefault } from "@ledgerhq/live-common/lib/env";
import { experimentalFeatures, isReadOnlyEnv } from "~/renderer/experimental";
import { useDispatch } from "react-redux";
import { setEnvOnAllThreads } from "~/helpers/env";
import type { Feature } from "~/renderer/experimental";
import { openModal } from "~/renderer/actions/modals";
import TrackPage from "~/renderer/analytics/TrackPage";
import useEnv from "~/renderer/hooks/useEnv";
import Button from "~/renderer/components/Button";
import { setShowClearCacheBanner } from "~/renderer/actions/settings";
import { SectionRow as Row } from "../../Rows";
import { Flex, Alert } from "@ledgerhq/react-ui";

import ExperimentalSwitch from "./ExperimentalSwitch";
import ExperimentalInteger from "./ExperimentalInteger";
import FullNode from "./FullNode";

const ExperimentalFeatureRow = ({
  feature,
  onDirtyChange,
}: {
  feature: Feature,
  onDirtyChange: () => void,
}) => {
  const { type, dirty, ...rest } = feature;
  const envValue = useEnv(feature.name);
  const isDefault = isEnvDefault(feature.name);
  const onChange = useCallback(
    (name, value) => {
      if (dirty) {
        onDirtyChange();
      }
      setEnvOnAllThreads(name, value);
    },
    [dirty, onDirtyChange],
  );

  return (
    <Row title={feature.title} desc={feature.description}>
      {feature.type === "toggle" ? (
        <ExperimentalSwitch
          readOnly={isReadOnlyEnv(feature.name)}
          isDefault={isDefault}
          onChange={onChange}
          valueOn={feature.valueOn}
          valueOff={feature.valueOff}
          {...rest} />  
      ) : (
        <ExperimentalInteger
          value={envValue}
          readOnly={isReadOnlyEnv(feature.name)}
          isDefault={isDefault}
          onChange={onChange}
          minValue={feature.minValue}
          maxValue={feature.maxValue}
          {...rest} />
      )}
    </Row>
  );
};

const EthereumBridgeRow = () => {
  const dispatch = useDispatch();

  return (
    <Row title="Open Ethereum WebSocket Bridge" desc="open a websocket bridge for web escape hatch">
      <Button
        onClick={() => {
          dispatch(
            openModal("MODAL_WEBSOCKET_BRIDGE", {
              appName: "Ethereum",
            }),
          );
        }}
      >
        Open
      </Button>
    </Row>
  );
};

const SectionExperimental = () => {
  const [needsCleanCache, setNeedsCleanCache] = useState(false);
  const dispatch = useDispatch();
  const onDirtyChange = useCallback(() => setNeedsCleanCache(true), []);

  useEffect(() => {
    return () => {
      if (needsCleanCache) {
        dispatch(setShowClearCacheBanner(true));
      }
    };
  }, [dispatch, needsCleanCache]);

  const { t } = useTranslation();

  return (
    <div data-e2e="experimental_section_title">
      <TrackPage category="Settings" name="Experimental" />
      <Flex flexDirection="column" rowGap={12}>
        <Alert type="warning" showIcon title={t("settings.experimental.disclaimer")} />
        {experimentalFeatures.map(feature =>
          !feature.shadow || (feature.shadow && !isEnvDefault(feature.name)) ? (
            <ExperimentalFeatureRow
              key={feature.name}
              feature={feature}
              onDirtyChange={onDirtyChange}
            />
          ) : null,
        )}
        {process.env.SHOW_ETHEREUM_BRIDGE ? <EthereumBridgeRow /> : null}
        <FullNode />
      </Flex>
    </div>
  );
};

export default SectionExperimental;

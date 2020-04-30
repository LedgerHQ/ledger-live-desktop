// @flow

import React from "react";
import { useTranslation } from "react-i18next";
import { isEnvDefault } from "@ledgerhq/live-common/lib/env";
import { experimentalFeatures, isReadOnlyEnv } from "~/renderer/experimental";
import { setEnvOnAllThreads } from "~/helpers/env";
import type { Feature } from "~/renderer/experimental";
import TrackPage from "~/renderer/analytics/TrackPage";
import useEnv from "~/renderer/hooks/useEnv";
import Disclaimer from "~/renderer/components/Disclaimer";
import IconAtom from "~/renderer/icons/Atom";
import IconSensitiveOperationShield from "~/renderer/icons/SensitiveOperationShield";
import {
  SettingsSection as Section,
  SettingsSectionHeader as Header,
  SettingsSectionBody as Body,
  SettingsSectionRow as Row,
} from "../../SettingsSection";
import ExperimentalSwitch from "./ExperimentalSwitch";
import ExperimentalInteger from "./ExperimentalInteger";

const experimentalTypesMap = {
  toggle: ExperimentalSwitch,
  integer: ExperimentalInteger,
};

const ExperimentalFeatureRow = ({ feature }: { feature: Feature }) => {
  const { type, ...rest } = feature;
  const Children = experimentalTypesMap[feature.type];
  const envValue = useEnv(feature.name);
  const isDefault = isEnvDefault(feature.name);

  return Children ? (
    <Row title={feature.title} desc={feature.description}>
      {/* $FlowFixMe */}
      <Children
        // $FlowFixMe
        value={envValue}
        readOnly={isReadOnlyEnv(feature.name)}
        // $FlowFixMe
        isDefault={isDefault}
        onChange={setEnvOnAllThreads}
        {...rest}
      />
    </Row>
  ) : null;
};

const SectionExperimental = () => {
  const { t } = useTranslation();

  return (
    <Section id="settings-experimental-container">
      <TrackPage category="Settings" name="Experimental" />

      <Header
        icon={<IconAtom size={16} />}
        title={t("settings.tabs.experimental")}
        desc={t("settings.experimental.desc")}
      />

      <Body>
        <Disclaimer
          m={4}
          icon={<IconSensitiveOperationShield />}
          content={t("settings.experimental.disclaimer")}
        />
        {experimentalFeatures.map(feature =>
          !feature.shadow || (feature.shadow && !isEnvDefault(feature.name)) ? (
            // $FlowFixMe
            <ExperimentalFeatureRow key={feature.name} feature={feature} />
          ) : null,
        )}
      </Body>
    </Section>
  );
};

export default SectionExperimental;

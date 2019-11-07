// @flow

import React, { PureComponent } from 'react'
import { translate, Trans } from 'react-i18next'
import { isEnvDefault } from '@ledgerhq/live-common/lib/env'
import { experimentalFeatures, isReadOnlyEnv } from 'helpers/experimental'
import { setEnvOnAllThreads } from 'helpers/env'
import type { T } from 'types/common'
import useEnv from 'hooks/useEnv'
import TrackPage from 'analytics/TrackPage'
import IconAtom from 'icons/Atom'
import IconSensitiveOperationShield from 'icons/SensitiveOperationShield'
import Disclaimer from 'components/Disclaimer'
import type { Feature } from 'helpers/experimental'

import {
  SettingsSection as Section,
  SettingsSectionHeader as Header,
  SettingsSectionBody as Body,
  SettingsSectionRow as Row,
} from '../SettingsSection'
import ExperimentalSwitch from '../ExperimentalSwitch'
import ExperimentalInteger from '../ExperimentalInteger'

type Props = {
  t: T,
}

const experimentalTypesMap = {
  toggle: ExperimentalSwitch,
  integer: ExperimentalInteger,
}

const ExperimentalFeatureRow = ({ feature }: { feature: Feature }) => {
  const { type, ...rest } = feature
  const Children = experimentalTypesMap[feature.type]
  const envValue = useEnv(feature.name)
  const isDefault = isEnvDefault(feature.name)

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
  ) : null
}

class SectionExperimental extends PureComponent<Props> {
  render() {
    const { t } = this.props

    return (
      <Section data-e2e="experimental_section_title">
        <TrackPage category="Settings" name="Experimental" />

        <Header
          icon={<IconAtom size={16} />}
          title={t('settings.tabs.experimental')}
          desc={t('settings.experimental.desc')}
        />

        <Body>
          <Disclaimer
            m={4}
            icon={<IconSensitiveOperationShield />}
            content={<Trans i18nKey="settings.experimental.disclaimer" />}
          />
          {experimentalFeatures.map(feature =>
            !feature.shadow || (feature.shadow && !isEnvDefault(feature.name)) ? (
              // $FlowFixMe
              <ExperimentalFeatureRow key={feature.name} feature={feature} />
            ) : null,
          )}
        </Body>
      </Section>
    )
  }
}

export default translate()(SectionExperimental)

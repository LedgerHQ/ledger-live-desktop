// @flow

import React, { PureComponent } from 'react'
import { shell } from 'electron'

import type { T } from 'types/common'

import IconHelp from 'icons/Help'
import IconChevronRight from 'icons/ChevronRight'

import {
  SettingsSection as Section,
  SettingsSectionHeader as Header,
  SettingsSectionBody as Body,
  SettingsSectionRow as Row,
} from '../SettingsSection'

type Props = {
  t: T,
}

class SectionAbout extends PureComponent<Props> {
  handleOpenLink = (url: string) => () => shell.openExternal(url)

  render() {
    const { t } = this.props
    return (
      <Section>
        <Header
          icon={<IconHelp size={16} />}
          title={t('settings:tabs.about')}
          desc="Lorem ipsum dolor sit amet"
        />
        <Body>
          <Row
            onClick={this.handleOpenLink('http://google.com')}
            title={t('settings:about.faq')}
            desc={t('settings:about.faqDesc')}
          >
            <IconChevronRight size={16} />
          </Row>
          <Row
            onClick={this.handleOpenLink('http://google.com')}
            title={t('settings:about.contactUs')}
            desc={t('settings:about.contactUsDesc')}
          >
            <IconChevronRight size={16} />
          </Row>
          <Row
            onClick={this.handleOpenLink('http://google.com')}
            title={t('settings:about.terms')}
            desc={t('settings:about.termsDesc')}
          >
            <IconChevronRight size={16} />
          </Row>
        </Body>
      </Section>
    )
  }
}

export default SectionAbout

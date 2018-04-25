// @flow

import React, { PureComponent } from 'react'
import { shell } from 'electron'

import type { T } from 'types/common'

import IconHelp from 'icons/Help'
import IconExternalLink from 'icons/ExternalLink'

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
            onClick={this.handleOpenLink('https://support.ledgerwallet.com/hc/en-us')}
            title={t('settings:about.faq')}
            desc={t('settings:about.faqDesc')}
          >
            <IconExternalLink size={16} />
          </Row>
          <Row
            onClick={this.handleOpenLink('https://support.ledgerwallet.com/hc/en-us/requests/new')}
            title={t('settings:about.contactUs')}
            desc={t('settings:about.contactUsDesc')}
          >
            <IconExternalLink size={16} />
          </Row>
          <Row
            onClick={this.handleOpenLink('https://www.ledgerwallet.com/terms')}
            title={t('settings:about.terms')}
            desc={t('settings:about.termsDesc')}
          >
            <IconExternalLink size={16} />
          </Row>
        </Body>
      </Section>
    )
  }
}

export default SectionAbout

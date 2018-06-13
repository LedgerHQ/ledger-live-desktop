// @flow

import React, { PureComponent } from 'react'
import { shell } from 'electron'
import { connect } from 'react-redux'

import type { T } from 'types/common'

import IconHelp from 'icons/Help'
import IconExternalLink from 'icons/ExternalLink'
import Button from 'components/base/Button'

import { openModal } from 'reducers/modals'
import { MODAL_RELEASES_NOTES } from 'config/constants'

import {
  SettingsSection as Section,
  SettingsSectionHeader as Header,
  SettingsSectionBody as Body,
  SettingsSectionRow as Row,
} from '../SettingsSection'

type Props = {
  t: T,
  openModal: Function,
}

const mapDispatchToProps = {
  openModal,
}

class SectionAbout extends PureComponent<Props> {
  handleOpenLink = (url: string) => () => shell.openExternal(url)

  render() {
    const { t, openModal } = this.props
    const version = __APP_VERSION__

    return (
      <Section>
        <Header
          icon={<IconHelp size={16} />}
          title={t('app:settings.tabs.about')}
          desc="Lorem ipsum dolor sit amet"
        />
        <Body>
          <Row title="Version" desc={version}>
            <Button
              primary
              onClick={() => {
                openModal(MODAL_RELEASES_NOTES, version)
              }}
            >
              Show release notes
            </Button>
          </Row>
          <Row
            onClick={this.handleOpenLink('https://support.ledgerwallet.com/hc/en-us')}
            title={t('app:settings.about.faq')}
            desc={t('app:settings.about.faqDesc')}
          >
            <IconExternalLink size={16} />
          </Row>
          <Row
            onClick={this.handleOpenLink('https://support.ledgerwallet.com/hc/en-us/requests/new')}
            title={t('app:settings.about.contactUs')}
            desc={t('app:settings.about.contactUsDesc')}
          >
            <IconExternalLink size={16} />
          </Row>
          <Row
            onClick={this.handleOpenLink('https://www.ledgerwallet.com/terms')}
            title={t('app:settings.about.terms')}
            desc={t('app:settings.about.termsDesc')}
          >
            <IconExternalLink size={16} />
          </Row>
        </Body>
      </Section>
    )
  }
}

export default connect(
  null,
  mapDispatchToProps,
)(SectionAbout)

// @flow
/* eslint-disable react/no-multi-comp */

import React, { PureComponent } from 'react'
import { shell } from 'electron'
import { connect } from 'react-redux'

import type { T } from 'types/common'

import IconHelp from 'icons/Help'
import IconExternalLink from 'icons/ExternalLink'
import Button from 'components/base/Button'
import { Tabbable } from 'components/base/Box'

import { openModal } from 'reducers/modals'
import { MODAL_RELEASES_NOTES } from 'config/constants'
import TrackPage from 'analytics/TrackPage'

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

const ITEMS = [
  {
    key: 'faq',
    title: t => t('app:settings.about.faq'),
    desc: t => t('app:settings.about.faqDesc'),
    url: 'https://support.ledgerwallet.com/hc/en-us',
  },
  {
    key: 'contact',
    title: t => t('app:settings.about.contactUs'),
    desc: t => t('app:settings.about.contactUsDesc'),
    url: 'https://support.ledgerwallet.com/hc/en-us/requests/new',
  },
  {
    key: 'terms',
    title: t => t('app:settings.about.terms'),
    desc: t => t('app:settings.about.termsDesc'),
    url: 'https://www.ledgerwallet.com/terms',
  },
]

class SectionAbout extends PureComponent<Props> {
  handleOpenLink = (url: string) => shell.openExternal(url)

  render() {
    const { t, openModal } = this.props
    const version = __APP_VERSION__

    return (
      <Section>
        <TrackPage category="Settings" name="About" />
        <Header
          icon={<IconHelp size={16} />}
          title={t('app:settings.tabs.about')}
          desc={t('app:settings.about.desc')}
        />
        <Body>
          <Row title={t('app:settings.about.version')} desc={version}>
            <Button
              primary
              onClick={() => {
                openModal(MODAL_RELEASES_NOTES, version)
              }}
            >
              {t('app:settings.about.releaseNotesBtn')}
            </Button>
          </Row>
          {ITEMS.map(item => (
            <AboutRowItem
              key={item.key}
              title={item.title(t)}
              desc={item.desc(t)}
              url={item.url}
              onClick={this.handleOpenLink}
            />
          ))}
        </Body>
      </Section>
    )
  }
}

class AboutRowItem extends PureComponent<{
  onClick: string => void,
  url: string,
  title: string,
  desc: string,
  url: string,
}> {
  render() {
    const { onClick, title, desc, url } = this.props
    const boundOnClick = () => onClick(url)
    return (
      <Row title={title} desc={desc}>
        <Tabbable p={2} borderRadius={1} onClick={boundOnClick}>
          <IconExternalLink style={{ cursor: 'pointer' }} size={16} />
        </Tabbable>
      </Row>
    )
  }
}

export default connect(
  null,
  mapDispatchToProps,
)(SectionAbout)

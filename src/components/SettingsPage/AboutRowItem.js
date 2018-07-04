// @flow
import React, { PureComponent } from 'react'
import { openURL } from 'helpers/linking'
import IconExternalLink from 'icons/ExternalLink'
import { Tabbable } from 'components/base/Box'
import { SettingsSectionRow } from './SettingsSection'

export default class AboutRowItem extends PureComponent<{
  url: string,
  title: string,
  desc: string,
}> {
  onClick = () => openURL(this.props.url)

  render() {
    const { title, desc } = this.props
    return (
      <SettingsSectionRow title={title} desc={desc}>
        <Tabbable p={2} borderRadius={1} onClick={this.onClick}>
          <IconExternalLink style={{ cursor: 'pointer' }} size={16} />
        </Tabbable>
      </SettingsSectionRow>
    )
  }
}

// @flow

import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'

import type { T } from 'types/common'

import { SettingsSectionHeader as Header } from '../../SettingsSection'
import { EXPERIMENTAL_WS_EXPORT } from '../../../../config/constants'
import IconShare from '../../../../icons/Share'
import Button from '../../../base/Button'
import SocketExport from '../../SocketExport'
import ExportOperationsBtn from '../../../ExportOperationsBtn'
import DownloadCloud from '../../../../icons/DownloadCloud'
import ExportAccountsModal from '../../ExportAccountsModal'

type Props = {
  t: T,
}

type State = {
  isModalOpened: boolean,
}
// TODO refactor out the export accounts into its own file
class SectionExport extends PureComponent<Props, State> {
  state = {
    isModalOpened: false,
  }

  onModalOpen = () => {
    this.setState({ isModalOpened: true })
  }

  onModalClose = () => {
    this.setState({ isModalOpened: false })
  }

  render() {
    const { t } = this.props
    const { isModalOpened } = this.state

    return (
      <>
        <Header
          icon={<IconShare size={16} />}
          title={t('settings.export.accounts.title')}
          desc={t('settings.export.accounts.desc')}
          renderRight={
            <Button small onClick={this.onModalOpen} primary>
              {t('settings.export.accounts.button')}
            </Button>
          }
        />
        <Header
          icon={<DownloadCloud size={16} />}
          title={t('settings.export.operations.title')}
          desc={t('settings.export.operations.desc')}
          renderRight={<ExportOperationsBtn primary />}
        />

        {EXPERIMENTAL_WS_EXPORT && (
          <Header
            icon={<IconShare size={16} />}
            title="Experimental websocket local export ⚡"
            desc="Generate a pairing code and use it on Ledger Live Mobile"
            renderRight={<SocketExport />}
          />
        )}
        <ExportAccountsModal isOpen={isModalOpened} onClose={this.onModalClose} />
      </>
    )
  }
}

export default translate()(SectionExport)

// @flow

import React, { PureComponent } from 'react'
import { Trans, translate } from 'react-i18next'

import type { T } from 'types/common'

import TrackPage from 'analytics/TrackPage'
import styled from 'styled-components'
import { SettingsSection as Section, SettingsSectionHeader as Header } from '../SettingsSection'
import { EXPERIMENTAL_WS_EXPORT } from '../../../config/constants'
import IconShare from '../../../icons/Share'
import Button from '../../base/Button'
import Modal from '../../base/Modal'
import ModalBody from '../../base/Modal/ModalBody'
import Box from '../../base/Box'
import QRCodeExporter from '../../QRCodeExporter'
import { BulletRow } from '../../Onboarding/helperComponents'
import Text from '../../base/Text'
import SocketExport from '../SocketExport'
import ExportOperationsBtn from '../../ExportOperationsBtn'
import DownloadCloud from '../../../icons/DownloadCloud'

const BulletRowIcon = styled(Box).attrs({
  ff: 'Rubik|Regular',
  fontSize: 10,
  textAlign: 'center',
  color: 'wallet',
  pl: 2,
})`
  background-color: rgba(100, 144, 241, 0.1);
  border-radius: 12px;
  display: inline-flex;
  height: 18px;
  width: 18px;
  padding: 0px;
  padding-top: 2px;
`

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

  renderModal = ({ onClose }: any) => {
    const { t } = this.props
    const stepsImportMobile = [
      {
        key: 'step1',
        icon: <BulletRowIcon>{'1'}</BulletRowIcon>,
        desc: (
          <Box style={{ display: 'block' }}>
            <Trans i18nKey="settings.export.modal.step1">
              {'Tap the'}
              <Text ff="Open Sans|SemiBold" color="dark">
                {'+'}
              </Text>
              {'button in'}
              <Text ff="Open Sans|SemiBold" color="dark">
                {'Accounts'}
              </Text>
            </Trans>
          </Box>
        ),
      },
      {
        key: 'step2',
        icon: <BulletRowIcon>{'2'}</BulletRowIcon>,
        desc: (
          <Box style={{ display: 'block' }}>
            <Trans i18nKey="settings.export.modal.step2">
              {'Tap'}
              <Text ff="Open Sans|SemiBold" color="dark">
                {'Import desktop accounts'}
              </Text>
            </Trans>
          </Box>
        ),
      },
      {
        key: 'step3',
        icon: <BulletRowIcon>{'3'}</BulletRowIcon>,
        desc: (
          <Box style={{ display: 'block' }}>
            <Trans i18nKey="settings.export.modal.step3">
              {'Scan the'}
              <Text ff="Open Sans|SemiBold" color="dark">
                {'LiveQR Code'}
              </Text>
              {'until the loader hits 100%'}
            </Trans>
          </Box>
        ),
      },
    ]

    return (
      <ModalBody
        onClose={onClose}
        title={t('settings.export.modal.title')}
        render={() => (
          <Box justify="center" align="center">
            <Box flow={2}>
              <QRCodeExporter size={330} />
            </Box>
            <Box shrink style={{ width: 330, fontSize: 13, marginTop: 20 }}>
              <Text ff="Open Sans|SemiBold" color="dark">
                {t('settings.export.modal.listTitle')}
              </Text>
            </Box>
            <Box style={{ width: 330 }}>
              {stepsImportMobile.map(step => (
                <BulletRow key={step.key} step={step} />
              ))}
            </Box>
          </Box>
        )}
        renderFooter={() => (
          <Box>
            <Button small onClick={onClose} primary>
              {t('settings.export.modal.button')}
            </Button>
          </Box>
        )}
      />
    )
  }

  render() {
    const { t } = this.props
    const { isModalOpened } = this.state

    return (
      <Section style={{ flowDirection: 'column' }}>
        <TrackPage category="Settings" name="Export" />

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
        <Modal isOpened={isModalOpened} onClose={this.onModalClose} render={this.renderModal} />
      </Section>
    )
  }
}

export default translate()(SectionExport)

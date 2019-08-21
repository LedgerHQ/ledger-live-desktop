// @flow

import React from 'react'
import styled from 'styled-components'

import type { T } from 'types/common'
import { Trans, translate } from 'react-i18next'

import Modal from 'components/base/Modal'
import ModalBody from 'components/base/Modal/ModalBody'
import Box from 'components/base/Box'
import Button from 'components/base/Button'
import QRCodeExporter from 'components/QRCodeExporter'
import { BulletRow } from 'components/Onboarding/helperComponents'
import Text from 'components/base/Text'

type OwnProps = {|
  isOpen: boolean,
  onClose: () => void,
|}

type Props = {|
  t: T,
  ...OwnProps,
|}

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

const ExportAccountsModal = ({ isOpen, onClose, t }: Props) => (
  <Modal
    isOpened={isOpen}
    onClose={onClose}
    render={({ onClose }: any) => {
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
    }}
  />
)

// prettier-ignore
export default React.memo<OwnProps>(
  translate()(ExportAccountsModal),
  (prev, next) => prev.isOpen === next.isOpen
)

// @flow
/* eslint react/jsx-no-literals: 0 */

import React, { PureComponent, Fragment } from 'react'
import { translate, Trans } from 'react-i18next'
import ReactMarkdown from 'react-markdown'

import type { T } from 'types/common'

import Modal, { ModalBody, ModalFooter, ModalTitle, ModalContent } from 'components/base/Modal'
import Text from 'components/base/Text'
import Button from 'components/base/Button'
import GrowScroll from 'components/base/GrowScroll'
import GradientBox from 'components/GradientBox'
import { Notes } from 'components/modals/ReleaseNotes'

import type { ModalStatus } from 'components/ManagerPage/FirmwareUpdate'

import { getCleanVersion } from 'components/ManagerPage/FirmwareUpdate'

type FirmwareInfos = {
  name: string,
  notes: string,
}

type Props = {
  t: T,
  status: ModalStatus,
  firmware: FirmwareInfos,
  goToNextStep: () => void,
  onClose: () => void,
}

type State = *

class DisclaimerModal extends PureComponent<Props, State> {
  render(): React$Node {
    const { status, firmware, onClose, t, goToNextStep } = this.props
    return (
      <Modal
        isOpened={status === 'disclaimer'}
        onClose={onClose}
        render={({ onClose }) => (
          <ModalBody onClose={onClose} grow align="center" justify="center" mt={3}>
            <Fragment>
              <ModalTitle>{t('app:manager.firmware.update')}</ModalTitle>
              <ModalContent>
                <Text ff="Open Sans|Regular" fontSize={4} color="graphite" align="center">
                  <Trans i18nKey="app:manager.firmware.disclaimerTitle">
                    You are about to install the latest
                    <Text ff="Open Sans|SemiBold" color="dark">
                      {`firmware ${firmware ? getCleanVersion(firmware.name) : ''}`}
                    </Text>
                  </Trans>
                </Text>
                <Text ff="Open Sans|Regular" fontSize={4} color="graphite" align="center">
                  {t('app:manager.firmware.disclaimerAppDelete')}
                  {t('app:manager.firmware.disclaimerAppReinstall')}
                </Text>
              </ModalContent>
              <ModalContent style={{ height: 250, width: '100%' }}>
                <GrowScroll>
                  <Notes>
                    <ReactMarkdown>{firmware.notes}</ReactMarkdown>
                  </Notes>
                </GrowScroll>
                <GradientBox />
              </ModalContent>
              <ModalFooter horizontal justifyContent="flex-end" style={{ width: '100%' }}>
                <Button primary onClick={goToNextStep}>
                  {t('app:manager.firmware.continue')}
                </Button>
              </ModalFooter>
            </Fragment>
          </ModalBody>
        )}
      />
    )
  }
}

export default translate()(DisclaimerModal)

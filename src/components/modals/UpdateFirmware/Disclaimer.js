// @flow
/* eslint react/jsx-no-literals: 0 */

import React, { PureComponent, Fragment } from 'react'
import { translate, Trans } from 'react-i18next'

import type { T } from 'types/common'

import Modal, { ModalBody, ModalFooter, ModalTitle, ModalContent } from 'components/base/Modal'
import Text from 'components/base/Text'
import Button from 'components/base/Button'
import GrowScroll from 'components/base/GrowScroll'
import GradientBox from 'components/GradientBox'
import Markdown, { Notes } from 'components/base/Markdown'
import TrackPage from 'analytics/TrackPage'

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
            <TrackPage category="Manager" name="DisclaimerModal" />
            <Fragment>
              <ModalTitle>{t('manager.firmware.update')}</ModalTitle>
              <ModalContent>
                <Text ff="Open Sans|Regular" fontSize={4} color="graphite" align="center">
                  <Trans i18nKey="manager.firmware.disclaimerTitle">
                    You are about to install
                    <Text ff="Open Sans|SemiBold" color="dark">
                      {`firmware version ${firmware ? getCleanVersion(firmware.name) : ''}`}
                    </Text>
                  </Trans>
                </Text>
                <Text ff="Open Sans|Regular" fontSize={4} color="graphite" align="center">
                  {t('manager.firmware.disclaimerAppDelete')}
                  {t('manager.firmware.disclaimerAppReinstall')}
                </Text>
              </ModalContent>
              <ModalContent relative pb={0} style={{ height: 250, width: '100%' }}>
                <GrowScroll pb={5}>
                  <Notes>
                    <Markdown>{firmware.notes}</Markdown>
                  </Notes>
                </GrowScroll>
                <GradientBox />
              </ModalContent>
              <ModalFooter horizontal justifyContent="flex-end" style={{ width: '100%' }}>
                <Button primary onClick={goToNextStep}>
                  {t('common.continue')}
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

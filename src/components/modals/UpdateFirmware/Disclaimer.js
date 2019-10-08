// @flow
/* eslint react/jsx-no-literals: 0 */

import React, { PureComponent } from 'react'
import { Trans, translate } from 'react-i18next'
import type { FinalFirmware, OsuFirmware } from '@ledgerhq/live-common/lib/types/manager'
import type { T } from 'types/common'

import Modal from 'components/base/Modal'
import ModalBody from 'components/base/Modal/ModalBody'
import Text from 'components/base/Text'
import Button from 'components/base/Button'
import GrowScroll from 'components/base/GrowScroll'
import GradientBox from 'components/GradientBox'
import Markdown, { Notes } from 'components/base/Markdown'
import styled from 'styled-components'
import TrackPage from 'analytics/TrackPage'

import type { ModalStatus } from 'components/ManagerPage/FirmwareUpdate'

import { getCleanVersion } from 'components/ManagerPage/FirmwareUpdate'
import Box from '../../base/Box/Box'

type Props = {
  t: T,
  status: ModalStatus,
  firmware: {
    osu: ?OsuFirmware,
    final: ?FinalFirmware,
  },
  goToNextStep: () => void,
  onClose: () => void,
}

type State = *

const NotesWrapper = styled(Box)`
  border-top: 1px solid ${p => p.theme.colors.lightGrey};
  height: 250px;
  margin-top: 8px;
  position: relative;
`

class DisclaimerModal extends PureComponent<Props, State> {
  render(): React$Node {
    const { status, firmware, onClose, t, goToNextStep } = this.props
    return (
      <Modal isOpened={status === 'disclaimer'} onClose={onClose}>
        <TrackPage category="Manager" name="DisclaimerModal" />
        <ModalBody
          grow
          align="center"
          justify="center"
          mt={3}
          title={t('manager.firmware.update')}
          render={() => (
            <Box>
              <Text ff="Inter|Regular" fontSize={4} color="palette.text.shade80" align="center">
                <Trans i18nKey="manager.firmware.disclaimerTitle">
                  You are about to install
                  <Text ff="Inter|SemiBold" color="palette.text.shade100">
                    {`firmware version ${
                      firmware && firmware.osu ? getCleanVersion(firmware.osu.name) : ''
                    }`}
                  </Text>
                </Trans>
              </Text>
              <Text ff="Inter|Regular" fontSize={4} color="palette.text.shade80" align="center">
                {t('manager.firmware.disclaimerAppDelete')}{' '}
                {t('manager.firmware.disclaimerAppReinstall')}
              </Text>
              {firmware && firmware.osu ? (
                <NotesWrapper>
                  <GrowScroll pb={5}>
                    <Notes>
                      <Markdown>{firmware.osu.notes}</Markdown>
                    </Notes>
                  </GrowScroll>
                  <GradientBox />
                </NotesWrapper>
              ) : null}
            </Box>
          )}
          renderFooter={() => (
            <Box horizontal justifyContent="flex-end">
              <Button primary onClick={goToNextStep}>
                {t('common.continue')}
              </Button>
            </Box>
          )}
        />
      </Modal>
    )
  }
}

export default translate()(DisclaimerModal)

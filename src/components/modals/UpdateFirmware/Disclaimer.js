// @flow

import React, { PureComponent } from 'react'
import { Trans, translate } from 'react-i18next'
import type { FinalFirmware, OsuFirmware } from '@ledgerhq/live-common/lib/types/manager'
import type { T } from 'types/common'
import { openURL } from 'helpers/linking'
import { urls } from 'config/urls'

import IconTrash from 'icons/Trash'
import Modal from 'components/base/Modal'
import ModalBody from 'components/base/Modal/ModalBody'
import Text from 'components/base/Text'
import Button from 'components/base/Button'
import Markdown, { Notes } from 'components/base/Markdown'
import styled from 'styled-components'
import TrackPage from 'analytics/TrackPage'
import Tip from 'components/base/Tip'
import CheckBox from 'components/base/CheckBox'
import FakeLink from 'components/base/FakeLink'
import { rgba } from 'styles/helpers'

import type { ModalStatus } from 'components/ManagerPage/FirmwareUpdate'

import { getCleanVersion } from 'components/ManagerPage/FirmwareUpdate'
import Box from '../../base/Box/Box'
import IconExternalLink from '../../../icons/ExternalLink'
import IconChevronRight from '../../../icons/ChevronRight'

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
  margin-top: 8px;
  position: relative;
`

const Bullets = styled.div`
  & > div {
    margin-bottom: 8px;
  }
`

const Bullet = styled.div`
  height: 6px;
  width: 6px;
  border-radius: 6px;
  display: inline-block;
  margin-right: 11px;
  background-color: ${p => rgba(p.theme.colors.palette.primary.main, 0.5)};
`

const InfoBubble = styled.div`
  width: 70px;
  height: 70px;
  background-color: ${p => rgba(p.theme.colors.palette.primary.main, 0.1)};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  color: ${p => p.theme.colors.palette.primary.main};
`

class DisclaimerModal extends PureComponent<Props, State> {
  state = {
    seedReady: false,
    showUninsWarning: false,
  }

  onClose() {
    this.setState({
      seedReady: false,
      showUninsWarning: false,
    })
    this.props.onClose()
  }

  render(): React$Node {
    const { status, firmware, onClose, t, goToNextStep } = this.props
    const { showUninsWarning } = this.state

    return (
      <Modal isOpened={status === 'disclaimer'} centered onClose={onClose}>
        <ModalBody
          grow
          align="center"
          justify="center"
          mt={3}
          title={t('manager.firmware.update')}
          render={() => (
            <Box align="center">
              {showUninsWarning ? (
                <>
                  <TrackPage category="Manager" name="DisclaimerModalUninstallAppWarning" />
                  <InfoBubble>
                    <IconTrash size={32} />
                  </InfoBubble>

                  <Text
                    ff="Inter|SemiBold"
                    fontSize={5}
                    style={{ marginBottom: 24, maxWidth: 250, textAlign: 'center' }}
                    color="palette.text.shade100"
                  >
                    {t('manager.firmware.appsAutoUninstallTitle')}
                  </Text>
                  <Bullets>
                    <div>
                      <Bullet />
                      <Text ff="Inter" fontSize={4} color="palette.text.shade60">
                        <Trans i18nKey={'manager.firmware.appsAutoUninstallBullet1'}>
                          <Text ff="Inter|Bold" fontSize={4} color="palette.text.shade100">
                            {"Don't worry"}
                          </Text>
                          {', this does not affect your crypto assets'}
                        </Trans>
                      </Text>
                    </div>
                    <div>
                      <Text align="center" ff="Inter" fontSize={4} color="palette.text.shade60">
                        <Bullet />
                        <Trans i18nKey="manager.firmware.appsAutoUninstallBullet2" />
                      </Text>
                    </div>
                  </Bullets>
                </>
              ) : (
                <>
                  <TrackPage category="Manager" name="DisclaimerModal" />
                  <Text ff="Inter|Regular" fontSize={4} color="palette.text.shade80" align="center">
                    <Trans
                      i18nKey="manager.firmware.disclaimerTitle"
                      values={{
                        version:
                          firmware && firmware.final ? getCleanVersion(firmware.final.name) : '',
                      }}
                    >
                      {'You are about to install'}
                      <Text ff="Inter|SemiBold" color="palette.text.shade100">
                        {'firmware version {{version}}'}
                      </Text>
                    </Trans>
                  </Text>
                  <FakeLink onClick={() => openURL(urls.updateDeviceFirmware)}>
                    <Text ff="Inter|SemiBold" fontSize={4} style={{ textDecoration: 'underline' }}>
                      {t('manager.firmware.followTheGuide')}
                    </Text>
                    <IconChevronRight size={14} style={{ marginLeft: 4 }} />
                  </FakeLink>
                  <Tip>
                    <Text ff="Inter|Regular" fontSize={4}>
                      {t('manager.firmware.prepareSeed')}
                    </Text>
                    <FakeLink style={{ marginTop: 4 }} onClick={() => openURL(urls.lostPinOrSeed)}>
                      <Text ff="Inter|Regular" fontSize={4} style={{ textDecoration: 'underline' }}>
                        {t('manager.firmware.dontHaveSeed')}
                      </Text>
                      <IconExternalLink size={14} style={{ marginLeft: 4 }} />
                    </FakeLink>
                  </Tip>
                  {firmware && firmware.osu ? (
                    <NotesWrapper>
                      <Notes>
                        <Markdown>{firmware.osu.notes}</Markdown>
                      </Notes>
                    </NotesWrapper>
                  ) : null}
                </>
              )}
            </Box>
          )}
          renderFooter={() => (
            <Box horizontal justifyContent="flex-end" alignItems="center" style={{ flex: 1 }}>
              {!showUninsWarning ? (
                <Box
                  horizontal
                  align="center"
                  onClick={() => this.setState(state => ({ seedReady: !state.seedReady }))}
                  style={{ flex: 1 }}
                >
                  <CheckBox isChecked={this.state.seedReady} />
                  <Text
                    ff="Inter|SemiBold"
                    fontSize={4}
                    style={{ marginLeft: 8, overflowWrap: 'break-word', flex: 1 }}
                  >
                    {t('manager.firmware.seedReady')}
                  </Text>
                </Box>
              ) : null}
              <Box horizontal>
                <Button onClick={() => this.onClose()}>{t('manager.firmware.updateLater')}</Button>
                <Button
                  disabled={!this.state.seedReady}
                  primary
                  onClick={
                    showUninsWarning
                      ? goToNextStep
                      : () => this.setState({ showUninsWarning: true })
                  }
                  style={{ marginLeft: 10 }}
                >
                  {t('common.continue')}
                </Button>
              </Box>
            </Box>
          )}
        />
      </Modal>
    )
  }
}

export default translate()(DisclaimerModal)

// @flow

import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'
import Box, { Card } from 'components/base/Box'
import Modal, { ModalBody, ModalContent, ModalTitle } from 'components/base/Modal'
import Button from 'components/base/Button'
import QRCodeExporter from 'components/QRCodeExporter'

class TabProfile extends PureComponent<*, *> {
  state = {
    qrcodeMobileExportModal: false,
  }

  onQRCodeMobileExport = () => {
    this.setState({ qrcodeMobileExportModal: true })
  }

  onRequestClose = () => {
    this.setState({ qrcodeMobileExportModal: false })
  }

  renderQRCodeModal = ({ onClose }: any) => (
    <ModalBody onClose={onClose} justify="center" align="center">
      <ModalTitle>{'QRCode Mobile Export'}</ModalTitle>
      <ModalContent flow={4}>
        <Box>
          Open Ledger Wallet Mobile App, go to <strong>Settings {'>'} Import Accounts</strong>
        </Box>
        <QRCodeExporter />
      </ModalContent>
    </ModalBody>
  )

  render() {
    const { qrcodeMobileExportModal } = this.state
    return (
      <Card flow={3}>
        <Box horizontal>
          <Button small onClick={this.onQRCodeMobileExport} primary>
            QRCode Mobile Export
          </Button>

          <Modal
            isOpened={qrcodeMobileExportModal}
            onClose={this.onRequestClose}
            render={this.renderQRCodeModal}
          />
        </Box>
      </Card>
    )
  }
}

export default translate()(TabProfile)

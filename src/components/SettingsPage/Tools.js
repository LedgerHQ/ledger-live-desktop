// @flow

import React, { PureComponent } from 'react'

import Box, { Card } from 'components/base/Box'
import Modal, { ModalBody } from 'components/base/Modal'
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

  renderQRCodeModal = ({ onClose }: *) => (
    <ModalBody onClick={onClose} justify="center" align="center">
      <p style={{ padding: '1em' }}>
        {/* TODO translate */}
        Open Ledger Wallet Mobile App, go to <strong>Settings {'>'} Import Accounts</strong>
      </p>
      <QRCodeExporter />
    </ModalBody>
  )

  render() {
    const { qrcodeMobileExportModal } = this.state
    return (
      <Card flow={3}>
        <Box horizontal>
          <Button onClick={this.onQRCodeMobileExport} primary>
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

export default TabProfile

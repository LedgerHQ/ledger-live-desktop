// @flow

import React, { PureComponent } from 'react'

import { ConfirmModal } from 'components/base/Modal'
import { openUserDataFolderAndQuit } from 'helpers/reset'

type Props = {
  isOpened: boolean,
  onClose: () => *,
}

class ResetFallbackModal extends PureComponent<Props> {
  render() {
    const { isOpened, onClose } = this.props
    return (
      <ConfirmModal
        centered
        isOpened={isOpened}
        onConfirm={openUserDataFolderAndQuit}
        onClose={onClose}
        onReject={onClose}
        confirmText={'Open folder'}
        title="Couldnt remove app files"
        desc={
          <div>
            <p>{'Cache folder couldnt be deleted. You will have to delete it manually.'}</p>
            <p style={{ fontWeight: 'bold' }}>
              {'Click on "Open folder", then the '}
              <span style={{ textDecoration: 'underline' }}>{'app will close'}</span>
              {', and you will have to delete the "sqlite" folder.'}
            </p>
            <p style={{ marginTop: 20 }}>{'After that, you can restart the app.'}</p>
          </div>
        }
      />
    )
  }
}

export default ResetFallbackModal

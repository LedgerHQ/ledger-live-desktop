// @flow

import React from 'react'

import type { T } from 'types/common'
import { translate } from 'react-i18next'
import type { Account } from '@ledgerhq/live-common/lib/types'

import Exporter from 'components/Exporter'
import Modal from 'components/base/Modal'
import ModalBody from 'components/base/Modal/ModalBody'
import Box from 'components/base/Box'
import Button from 'components/base/Button'

type OwnProps = {|
  isOpen: boolean,
  onClose: () => void,
  accounts?: Account[],
|}

type Props = {|
  t: T,
  ...OwnProps,
|}

const ExportAccountsModal = ({ isOpen, onClose, t, accounts }: Props) => (
  <Modal
    isOpened={isOpen}
    onClose={onClose}
    render={({ onClose }: any) => (
      <ModalBody
        onClose={onClose}
        title={t('settings.export.modal.title')}
        render={() => <Exporter accounts={accounts} />}
        renderFooter={() => (
          <Box>
            <Button small onClick={onClose} primary>
              {t('settings.export.modal.button')}
            </Button>
          </Box>
        )}
      />
    )}
  />
)

// prettier-ignore
export default React.memo<OwnProps>(
  translate()(ExportAccountsModal),
  (prev, next) => prev.isOpen === next.isOpen
)

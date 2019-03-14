// @flow
import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'
import type { T } from 'types/common'
import { MODAL_EXPORT_OPERATIONS } from 'config/constants'
import Modal from 'components/base/Modal'
import { activeAccountsSelector } from 'reducers/accounts'
import ModalBody from 'components/base/Modal/ModalBody'
import Button from 'components/base/Button'
import Box from 'components/base/Box'
import AccountsList from 'components/base/AccountsList'
import { compose } from 'redux'
import connect from 'react-redux/es/connect/connect'
import { remote } from 'electron'
import moment from 'moment'
import { accountsOpToCSV } from '@ledgerhq/live-common/lib/csvExport'
import fs from 'fs'
import type { Account } from '@ledgerhq/live-common/lib/types'
import logger from 'logger'
import styled from 'styled-components'
import { createStructuredSelector } from 'reselect'
import { closeModal } from '../../reducers/modals'
import DownloadCloud from '../../icons/DownloadCloud'

type Props = {
  t: T,
  closeModal: string => void,
  accounts: Account[],
}

type State = {
  checkedIds: string[],
}
const mapStateToProps = createStructuredSelector({
  accounts: activeAccountsSelector,
})
const mapDispatchToProps = {
  closeModal,
}

function writeToFile(file, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, error => {
      if (error) {
        reject(error)
      } else {
        resolve()
      }
    })
  })
}

class ExportOperations extends PureComponent<Props, State> {
  state = {
    checkedIds: [],
  }

  export = async () => {
    const { accounts } = this.props
    const { checkedIds } = this.state
    const path = remote.dialog.showSaveDialog({
      title: 'Exported account transactions',
      defaultPath: `ledgerlive-export-${moment().format(
        'YYYY.MM.DD-HH.mm.ss',
      )}-${__GIT_REVISION__ || 'unversionned'}.csv`,
      filters: [
        {
          name: 'All Files',
          extensions: ['csv'],
        },
      ],
    })

    if (path) {
      const data = accountsOpToCSV(accounts.filter(account => checkedIds.includes(account.id)))
      const json = JSON.stringify(data)
      writeToFile(path, json)
    }
  }

  exporting = false

  handleExport = () => {
    if (this.exporting) return
    this.exporting = true
    this.export()
      .catch(e => {
        logger.critical(e)
      })
      .then(() => {
        this.exporting = false
      })
  }

  onClose = () => this.props.closeModal(MODAL_EXPORT_OPERATIONS)

  toggleAccount = (account: Account) => {
    this.setState(prevState => {
      if (prevState.checkedIds.includes(account.id)) {
        return { checkedIds: [...prevState.checkedIds].filter(id => id !== account.id) }
      }
      return { checkedIds: [...prevState.checkedIds, account.id] }
    })
  }

  render() {
    const { t, accounts } = this.props
    const { checkedIds } = this.state

    return (
      <Modal name={MODAL_EXPORT_OPERATIONS} centered>
        <ModalBody
          onClose={this.onClose}
          title={t('exportOperationsModal.title')}
          render={() => (
            <Box>
              <IconWrapperCircle color="alertRed">
                <DownloadCloud />
              </IconWrapperCircle>
              <LabelWrapper>{t('exportOperationsModal.desc')}</LabelWrapper>
              <AccountsList
                emptyText={t('exportOperationsModal.noAccounts')}
                title={t('exportOperationsModal.selectedAccounts')}
                accounts={accounts}
                onToggleAccount={this.toggleAccount}
                checkedIds={checkedIds}
              />
            </Box>
          )}
          renderFooter={() => (
            <Box horizontal justifyContent="flex-end">
              <Button
                disabled={!checkedIds.length}
                data-e2e="continue_button"
                onClick={this.handleExport}
                primary
              >
                {t('exportOperationsModal.cta')}
              </Button>
            </Box>
          )}
        />
      </Modal>
    )
  }
}

export const LabelWrapper = styled(Box)`
  text-align: center;
  font-size: 13px;
`
export const IconWrapperCircle = styled(Box)`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #6490f119;
  align-items: center;
  justify-content: center;
  align-self: center;
  margin-bottom: 15px;
`

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  translate(),
)(ExportOperations)

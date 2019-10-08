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
import IconDownloadCloud from 'icons/DownloadCloud'
import IconCheckCircle from 'icons/CheckCircle'
import { colors } from 'styles/theme'
import { closeModal } from '../../reducers/modals'

type Props = {
  t: T,
  closeModal: string => void,
  accounts: Account[],
}

type State = {
  checkedIds: string[],
  success: boolean,
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
    success: false,
  }

  export = async () => {
    const { accounts } = this.props
    const { checkedIds } = this.state
    const path = remote.dialog.showSaveDialog({
      title: 'Exported account transactions',
      defaultPath: `ledgerlive-operations-${moment().format('YYYY.MM.DD')}.csv`,
      filters: [
        {
          name: 'All Files',
          extensions: ['csv'],
        },
      ],
    })

    if (path) {
      writeToFile(
        path,
        accountsOpToCSV(accounts.filter(account => checkedIds.includes(account.id))),
      )
      this.setState({ success: true })
    }
  }

  exporting = false

  handleButtonClick = () => {
    const { success } = this.state
    if (success) {
      this.onClose()
    } else {
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
    const { checkedIds, success } = this.state
    let headerText = t('exportOperationsModal.selectedAccounts')
    if (checkedIds.length > 0) {
      headerText = `${headerText} (${checkedIds.length})`
    }

    return (
      <Modal
        name={MODAL_EXPORT_OPERATIONS}
        centered
        onHide={() => this.setState({ success: false, checkedIds: [] })}
      >
        <ModalBody
          onClose={this.onClose}
          title={t('exportOperationsModal.title')}
          render={() =>
            success ? (
              <Box>
                <IconWrapper>
                  <IconCheckCircle size={43} />
                </IconWrapper>
                <Title>{t('exportOperationsModal.titleSuccess')}</Title>
                <LabelWrapper ff="Inter|Regular">
                  {t('exportOperationsModal.descSuccess')}
                </LabelWrapper>
              </Box>
            ) : (
              <Box>
                <IconWrapperCircle>
                  <IconDownloadCloud />
                </IconWrapperCircle>
                <LabelWrapper ff="Inter|Regular">{t('exportOperationsModal.desc')}</LabelWrapper>
                <AccountsList
                  emptyText={t('exportOperationsModal.noAccounts')}
                  title={headerText}
                  accounts={accounts}
                  onToggleAccount={this.toggleAccount}
                  checkedIds={checkedIds}
                />
              </Box>
            )
          }
          renderFooter={() => (
            <Box horizontal justifyContent="flex-end">
              <Button
                disabled={!success && !checkedIds.length}
                data-e2e="continue_button"
                onClick={this.handleButtonClick}
                primary
              >
                {success ? t('exportOperationsModal.ctaSuccess') : t('exportOperationsModal.cta')}
              </Button>
            </Box>
          )}
        />
      </Modal>
    )
  }
}

const LabelWrapper = styled(Box)`
  text-align: center;
  font-size: 13px;
  font-family: 'Inter';
  font-weight: ;
`
const IconWrapperCircle = styled(Box)`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: ${props => (props.green ? '#66be5419' : '#6490f119')};
  color: ${props => (props.green ? '#66be54' : '#6490f1')};
  align-items: center;
  justify-content: center;
  align-self: center;
  margin-bottom: 15px;
`

const IconWrapper = styled(Box)`
  color: ${_ => colors.positiveGreen};
  align-self: center;
  margin-bottom: 15px;
`

const Title = styled(Box).attrs(() => ({
  ff: 'Inter',
  fontSize: 5,
  mt: 2,
  mb: 15,
  color: 'palette.text.shade100',
}))`
  text-align: center;
`

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  translate(),
)(ExportOperations)

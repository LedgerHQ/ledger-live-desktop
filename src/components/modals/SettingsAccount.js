// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import get from 'lodash/get'
import { push } from 'react-router-redux'

import { MODAL_SETTINGS_ACCOUNT } from 'constants'

import type { Account } from 'types/common'

import { editAccount } from 'actions/accounts'
import { setDataModal, closeModal } from 'reducers/modals'

import Box from 'components/base/Box'
import Button from 'components/base/Button'
import Input from 'components/base/Input'
import Modal, { ModalBody } from 'components/base/Modal'
import Text from 'components/base/Text'
import Icon from 'components/base/Icon'

type State = {
  accountName: string,
  editName: boolean,
  nameHovered: boolean,
}

type Props = {
  closeModal: Function,
  editAccount: Function,
  setDataModal: Function,
  push: Function,
}

const mapDispatchToProps = {
  closeModal,
  editAccount,
  setDataModal,
  push,
}

const defaultState = {
  editName: false,
  accountName: '',
  nameHovered: false,
}

class SettingsAccount extends PureComponent<Props, State> {
  state = {
    ...defaultState,
  }

  getAccount(data: Object) {
    const { accountName } = this.state

    const account = get(data, 'account', {})

    return {
      ...account,
      ...(accountName !== ''
        ? {
            name: accountName,
          }
        : {}),
    }
  }

  handleHoveredName = (state: boolean) => () =>
    this.setState({
      nameHovered: state,
    })

  handleEditName = (state: boolean) => () =>
    this.setState({
      nameHovered: false,
      editName: state,
    })

  handleChangeName = (value: string) =>
    this.setState({
      accountName: value,
    })

  handleCancelEditName = (data: Object) => () => {
    this.handleEditName(false)()
    this.setState({
      accountName: get(data, 'account.name', ''),
    })
  }

  handleSubmitName = (account: Account) => (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { editAccount, setDataModal } = this.props

    editAccount(account)
    setDataModal(MODAL_SETTINGS_ACCOUNT, { account })

    this.setState({
      editName: false,
    })
  }

  handleArchiveAccount = (account: Account) => () => {
    const { push, closeModal, editAccount } = this.props

    editAccount({
      ...account,
      archived: true,
    })
    closeModal(MODAL_SETTINGS_ACCOUNT)

    push('/')
  }

  handleHide = () =>
    this.setState({
      ...defaultState,
    })

  render() {
    const { editName, nameHovered } = this.state

    return (
      <Modal
        name={MODAL_SETTINGS_ACCOUNT}
        onHide={this.handleHide}
        render={({ data, onClose }) => {
          const account = this.getAccount(data)
          return (
            <ModalBody onClose={onClose} flow={3}>
              <Text fontSize={4} color="steel">
                Account settings
              </Text>
              <Box
                align="center"
                flow={2}
                horizontal
                onMouseEnter={this.handleHoveredName(true)}
                onMouseLeave={this.handleHoveredName(false)}
              >
                <Box>
                  {editName ? (
                    <form onSubmit={this.handleSubmitName(account)}>
                      <Box align="center" horizontal flow={2}>
                        <Box>
                          <Input value={account.name} onChange={this.handleChangeName} />
                        </Box>
                        <Box flow={2} horizontal>
                          <Button type="button" onClick={this.handleCancelEditName(data)}>
                            Cancel
                          </Button>
                          <Button type="submit" primary>
                            Ok
                          </Button>
                        </Box>
                      </Box>
                    </form>
                  ) : (
                    account.name
                  )}
                </Box>
                {!editName &&
                  nameHovered && (
                    <Box onClick={this.handleEditName(true)} style={{ cursor: 'pointer' }}>
                      <Icon name="edit" />
                    </Box>
                  )}
              </Box>
              <Box horizontal grow align="flex-end" flow={2}>
                <Box grow>
                  <Button onClick={this.handleArchiveAccount(account)}>Archive account</Button>
                </Box>
                <Box grow>
                  <Button primary>Go to account</Button>
                </Box>
              </Box>
            </ModalBody>
          )
        }}
      />
    )
  }
}

export default connect(null, mapDispatchToProps)(SettingsAccount)

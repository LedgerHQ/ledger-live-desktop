// @flow

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import get from 'lodash/get'
import { push } from 'react-router-redux'

import { MODAL_SETTINGS_ACCOUNT } from 'constants'

import type { Account } from 'types/common'

import { updateAccount, removeAccount } from 'actions/accounts'
import { setDataModal, closeModal } from 'reducers/modals'

import Box from 'components/base/Box'
import Button from 'components/base/Button'
import Input from 'components/base/Input'
import Modal, { ModalBody } from 'components/base/Modal'
import Text from 'components/base/Text'
import Icon from 'components/base/Icon'
import Label from 'components/base/Label'

type State = {
  accountName: string | null,
  minConfirmations: number | null,
  editName: boolean,
  nameHovered: boolean,
}

type Props = {
  closeModal: Function,
  push: Function,
  removeAccount: Function,
  setDataModal: Function,
  updateAccount: Function,
}

const mapDispatchToProps = {
  closeModal,
  push,
  removeAccount,
  setDataModal,
  updateAccount,
}

const defaultState = {
  editName: false,
  accountName: null,
  minConfirmations: null,
  nameHovered: false,
}

function hasNoTransactions(account: Account) {
  return get(account, 'transactions.length', 0) === 0
}

class SettingsAccount extends PureComponent<Props, State> {
  state = {
    ...defaultState,
  }

  getAccount(data: Object) {
    const { accountName, minConfirmations } = this.state

    const account = get(data, 'account', {})

    return {
      ...account,
      ...(accountName !== null
        ? {
            name: accountName,
          }
        : {}),
      settings: {
        ...account.settings,
        minConfirmations: minConfirmations || account.settings.minConfirmations,
      },
    }
  }

  handleHoveredName = (state: boolean) => () =>
    this.setState({
      nameHovered: state,
    })

  handleChangeMinConfirmations = account => minConfirmations => {
    const { updateAccount } = this.props
    this.setState({ minConfirmations })
    window.requestAnimationFrame(() => {
      updateAccount({
        ...account,
        settings: {
          ...account.settings,
          minConfirmations: Number(minConfirmations),
        },
      })
    })
  }

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

    const { updateAccount, setDataModal } = this.props
    const { accountName } = this.state

    if (accountName !== '') {
      updateAccount(account)
      setDataModal(MODAL_SETTINGS_ACCOUNT, { account })

      this.setState({
        editName: false,
      })
    }
  }

  handleArchiveAccount = (account: Account) => () => {
    const { push, closeModal, updateAccount, removeAccount } = this.props
    const shouldRemove = hasNoTransactions(account)

    if (shouldRemove) {
      removeAccount(account)
    } else {
      updateAccount({ ...account, archived: true })
    }

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
              <Text fontSize={4} color="graphite">
                Account settings
              </Text>
              <Box
                alignItems="center"
                flow={2}
                horizontal
                onMouseEnter={this.handleHoveredName(true)}
                onMouseLeave={this.handleHoveredName(false)}
              >
                <Box>
                  {editName ? (
                    <form onSubmit={this.handleSubmitName(account)}>
                      <Box alignItems="center" horizontal flow={2}>
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
              <Box>
                <Label>{'Minimum confirmations'}</Label>
                <Input
                  type="number"
                  min={1}
                  max={100}
                  value={account.settings.minConfirmations}
                  onChange={this.handleChangeMinConfirmations(account)}
                />
              </Box>
              <Box horizontal grow alignItems="flex-end" flow={2}>
                <Box grow>
                  <Button onClick={this.handleArchiveAccount(account)}>
                    {hasNoTransactions(account) ? 'Remove account' : 'Archive account'}
                  </Button>
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

// @flow

import React, { PureComponent } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import styled from 'styled-components'
import { T, translate } from 'react-i18next'

import Box from 'components/base/Box'
import Button from 'components/base/Button'
import Switch from 'components/base/Switch'
import Tooltip from 'components/base/Tooltip'
import DropDown, { DropDownItem } from 'components/base/DropDown'
import ExportAccountsModal from 'components/SettingsPage/ExportAccountsModal'
import Track from 'analytics/Track'

import { setHideEmptyTokenAccounts } from 'actions/settings'
import { hideEmptyTokenAccountsSelector } from 'reducers/settings'
import { openModal } from 'reducers/modals'

import { MODAL_EXPORT_OPERATIONS } from 'config/constants'

import IconDots from 'icons/Dots'
import IconDownloadCloud from 'icons/DownloadCloud'
import IconSend from 'icons/Send'

const Separator = styled.div`
  background-color: ${p => p.theme.colors.palette.divider};
  height: 1px;
  margin-top: 8px;
  margin-bottom: 8px;
`

const Item = styled(DropDownItem)`
  width: 230px;
  cursor: pointer;
  white-space: pre-wrap;
  justify-content: flex-start;
  align-items: center;
  background-color: ${p =>
    !p.disableHover && p.isHighlighted && p.theme.colors.palette.background.default};
`

type StateProps = {|
  hideEmptyTokenAccounts: boolean,
|}

type DispatchProps = {|
  setHideEmptyTokenAccounts: boolean => any,
  openModal: (string, any) => any,
|}

type OwnProps = {|
  t: T,
|}

type Props = {|
  ...OwnProps,
  ...DispatchProps,
  ...StateProps,
|}

type State = {|
  isModalOpened: boolean,
|}

const mapDispatchToProps: DispatchProps = {
  setHideEmptyTokenAccounts,
  openModal,
}

const mapStateToProps: StateProps = createStructuredSelector({
  hideEmptyTokenAccounts: hideEmptyTokenAccountsSelector,
})

class OptionsButton extends PureComponent<Props, State> {
  state = {
    isModalOpened: false,
  }

  items = [
    {
      key: 'exportOperations',
      label: this.props.t('accounts.optionsMenu.exportOperations'),
      icon: <IconDownloadCloud size={16} />,
      onClick: () => this.props.openModal(MODAL_EXPORT_OPERATIONS),
    },
    {
      key: 'exportAccounts',
      label: this.props.t('accounts.optionsMenu.exportToMobile'),
      icon: <IconSend size={16} />,
      onClick: () => this.setState({ isModalOpened: true }),
    },
    {
      key: 'sep1',
      type: 'separator',
      label: '',
    },
    {
      key: 'hideEmpty',
      label: this.props.t('settings.accounts.hideEmptyTokens.title'),
      onClick: (e: MouseEvent) => {
        e.preventDefault()
        this.props.setHideEmptyTokenAccounts(!this.props.hideEmptyTokenAccounts)
      },
    },
  ]

  renderItem = ({ item, isHighlighted }) => {
    if (item.type === 'separator') {
      return <Separator />
    }

    return (
      <Item
        horizontal
        isHighlighted={isHighlighted}
        flow={2}
        onClick={item.onClick}
        disableHover={item.key === 'hideEmpty'}
      >
        {item.key === 'hideEmpty' ? (
          <Box mr={4}>
            <Track
              onUpdate
              event={
                this.props.hideEmptyTokenAccounts
                  ? 'hideEmptyTokenAccountsEnabled'
                  : 'hideEmptyTokenAccountsDisabled'
              }
            />
            <Switch
              isChecked={this.props.hideEmptyTokenAccounts}
              onChange={this.props.setHideEmptyTokenAccounts}
            />
          </Box>
        ) : item.icon ? (
          <Box mr={4}>{item.icon}</Box>
        ) : null}
        {item.label}
      </Item>
    )
  }

  render() {
    const { isModalOpened } = this.state

    return (
      <>
        <DropDown border horizontal offsetTop={2} items={this.items} renderItem={this.renderItem}>
          <Tooltip content={this.props.t('accounts.optionsMenu.title')}>
            <Button small outlineGrey flow={1} style={{ width: 34, padding: 0 }}>
              <Box horizontal flow={1} alignItems="center" justifyContent="center">
                <IconDots size={14} />
              </Box>
            </Button>
          </Tooltip>
        </DropDown>
        <ExportAccountsModal
          isOpen={isModalOpened}
          onClose={() => this.setState({ isModalOpened: false })}
        />
      </>
    )
  }
}

export default compose(
  translate(),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(OptionsButton)

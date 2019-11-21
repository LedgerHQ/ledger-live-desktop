// @flow
import React from 'react'
import styled from 'styled-components'
import { Trans } from 'react-i18next'
import { connect } from 'react-redux'
import type { AccountLike, Account } from '@ledgerhq/live-common/lib/types'

import { MODAL_RECEIVE } from 'config/constants'
import { openModal } from 'reducers/modals'

import UserEdit from 'icons/UserEdit'
import ArrowDown from 'icons/ArrowDown'
import StopCircle from 'icons/StopCircle'

import Box from 'components/base/Box'
import Text from 'components/base/Text'
import DropDown, { DropDownItem } from 'components/base/DropDown'

import IconDots from 'icons/Dots'

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
`

const Item = styled(DropDownItem)`
  width: 160px;
  cursor: pointer;
  white-space: pre-wrap;
  justify-content: flex-start;
  align-items: center;
  background-color: ${p =>
    !p.disableHover && p.isHighlighted && p.theme.colors.palette.background.default};
`

type Props = {
  account: AccountLike,
  parentAccount: ?Account,
  openModal: (string, any) => void,
}

const ContextMenu = ({ account, parentAccount, openModal }: Props) => {
  const items = [
    {
      key: 'topUp',
      label: <Trans i18nKey="delegation.contextMenu.topUp" />,
      icon: <ArrowDown size={16} />,
      onClick: () => openModal(MODAL_RECEIVE, { parentAccount, account }),
    },
    {
      key: 'redelegate',
      label: <Trans i18nKey="delegation.contextMenu.redelegate" />,
      icon: <UserEdit size={16} />,
      onClick: () =>
        openModal('MODAL_DELEGATE', {
          parentAccount,
          account,
          stepId: 'summary',
        }),
    },
    {
      key: 'stopDelegation',
      label: <Trans i18nKey="delegation.contextMenu.stopDelegation" />,
      icon: <StopCircle size={16} />,
      onClick: () =>
        openModal('MODAL_DELEGATE', {
          parentAccount,
          account,
          mode: 'undelegate',
          stepId: 'summary',
        }),
    },
  ]

  const renderItem = ({
    item,
    isHighlighted,
  }: {
    item: {
      key: string,
      label: React$Node,
      icon: React$Node,
      onClick: () => void,
    },
    isHighlighted: boolean,
  }) => {
    const color = item.key === 'stopDelegation' ? 'alertRed' : 'palette.text.shade100'
    return (
      <Item horizontal isHighlighted={isHighlighted} flow={2} onClick={item.onClick}>
        {item.icon ? (
          <Box mr={12} color={color}>
            {item.icon}
          </Box>
        ) : null}
        <Text ff="Inter|SemiBold" fontSize={3} color={color}>
          {item.label}
        </Text>
      </Item>
    )
  }

  return (
    <DropDown
      offsetTop={-12}
      offsetRight={15}
      border
      horizontal
      items={items}
      renderItem={renderItem}
    >
      <Container small outlineGrey flow={1} style={{ width: 34, padding: 0 }}>
        <Box horizontal flow={1} alignItems="center" justifyContent="center">
          <IconDots size={14} />
        </Box>
      </Container>
    </DropDown>
  )
}

export default connect(
  null,
  { openModal },
)(ContextMenu)

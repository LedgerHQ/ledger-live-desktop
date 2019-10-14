// @flow

import React, { PureComponent } from 'react'
import styled from 'styled-components'
import { Trans, translate } from 'react-i18next'
import IconAngleDown from 'icons/AngleDown'
import IconCheck from 'icons/Check'
import { createSelector, createStructuredSelector } from 'reselect'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { getAssetsDistribution } from '@ledgerhq/live-common/lib/portfolio'
import { push } from 'react-router-redux'

import Text from 'components/base/Text'
import CryptoCurrencyIcon from 'components/CryptoCurrencyIcon'
import { accountsSelector } from 'reducers/accounts'
import DropDown from 'components/base/DropDown'
import Button, { Base } from 'components/base/Button'
import { calculateCountervalueSelector } from 'actions/general'
import { Separator } from './index'

type Props = {
  match: {
    params: {
      assetId: string,
    },
    isExact: boolean,
    path: string,
    url: string,
  },
  distribution: *,
  push: string => void,
}

const Item = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  padding: 12px;
  min-width: 200px;
  color: ${p =>
    p.isActive ? p.theme.colors.palette.text.shade100 : p.theme.colors.palette.text.shade80};
  > :first-child {
    margin-right: 10px;
  }

  > ${Text} {
    flex: 1;
  }

  &:hover {
    background: ${p => p.theme.colors.palette.background.default};
    border-radius: 4px;
  }
`

const TextLink = styled.div`
  font-family: 'Inter';
  font-size: 12px;
  align-items: center;
  display: flex;
  flex-direction: row;
  -webkit-app-region: no-drag;
  > :first-child {
    margin-right: 8px;
  }
  ${p => (p.shrink ? 'flex: 1;' : '')}

  > ${Base} {
    text-overflow: ellipsis;
    flex-shrink: 1;
    overflow: hidden;
    padding: 0px;
    &:hover,
    &:active {
      background: transparent;
      text-decoration: underline;
    }
    margin-right: 7px;
  }
`
const AngleDown = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 20px;
  text-align: center;
  line-height: 16px;

  &:hover {
    background: ${p => p.theme.colors.palette.divider};
  }
`

const Check = styled.div`
  color: ${p => p.theme.colors.wallet};
  align-items: center;
  display: flex;
  text-align: right;
  margin-left: 20px;
`

const distributionSelector = createSelector(
  accountsSelector,
  calculateCountervalueSelector,
  (acc, calc) =>
    getAssetsDistribution(acc, calc, {
      minShowFirst: 6,
      maxShowFirst: 6,
      showFirstThreshold: 0.95,
    }),
)

const mapStateToProps = createStructuredSelector({
  distribution: distributionSelector,
})

const mapDispatchToProps = {
  push,
}

class AssetCrumb extends PureComponent<Props> {
  renderItem = ({ item, isActive }) => (
    <Item key={item.currency.id} isActive={isActive}>
      <CryptoCurrencyIcon size={16} currency={item.currency} />
      <Text ff={`Inter|${isActive ? 'SemiBold' : 'Regular'}`} fontSize={4}>
        {item.label}
      </Text>
      {isActive && (
        <Check>
          <IconCheck size={14} />
        </Check>
      )}
    </Item>
  )

  onAccountSelected = ({ selectedItem: item }) => {
    if (!item) {
      return
    }

    const { push } = this.props
    const { currency } = item

    push(`/asset/${currency.id}`)
  }

  processItemsForDropdown = (items: any[]) =>
    items.map(({ currency }) => ({ key: currency.id, label: currency.name, currency }))

  render() {
    const {
      distribution,
      push,
      match: {
        params: { assetId },
      },
    } = this.props
    if (!distribution || !distribution.list) return null

    const items = this.processItemsForDropdown(distribution.list)
    const activeItem = distribution.list.find(distribution => distribution.currency.id === assetId)
    if (!activeItem) return null
    return (
      <>
        <TextLink>
          <Button onClick={() => push('/')}>
            <Trans>{'dashboard.title'}</Trans>
          </Button>
        </TextLink>
        <Separator />
        <DropDown
          flex={1}
          offsetTop={0}
          border
          horizontal
          items={items}
          active={activeItem}
          renderItem={this.renderItem}
          onStateChange={this.onAccountSelected}
        >
          <TextLink>
            {activeItem && <CryptoCurrencyIcon size={14} currency={activeItem.currency} />}
            <Button>{activeItem.currency.name}</Button>
            <AngleDown>
              <IconAngleDown size={16} />
            </AngleDown>
          </TextLink>
        </DropDown>
      </>
    )
  }
}

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  translate(),
)(AssetCrumb)

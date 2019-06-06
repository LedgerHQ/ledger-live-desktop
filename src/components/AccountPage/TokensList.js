// @flow

import React, { PureComponent } from 'react'
import type { PortfolioRange } from '@ledgerhq/live-common/lib/types/portfolio'
import styled from 'styled-components'
import { translate } from 'react-i18next'
import { push } from 'react-router-redux'
import { connect } from 'react-redux'
import { compose } from 'redux'
import type { Account, TokenAccount } from '@ledgerhq/live-common/lib/types/account'
import Box from 'components/base/Box'
import Text from 'components/base/Text'
import type { T } from 'types/common'
import IconPlus from 'icons/Plus'
import TokenRow from '../TokenRow'
import Button from '../base/Button'

type Props = {
  account: Account,
  push: string => void,
  t: T,
  range: PortfolioRange,
}

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`

const mapDispatchToProps = {
  push,
}

class TokensList extends PureComponent<Props> {
  onAccountClick = (account: TokenAccount, parentAccount: Account) =>
    this.props.push(`/account/${parentAccount.id}/${account.id}`)

  render() {
    const { account, t, range } = this.props
    if (!account.tokenAccounts) return null

    return (
      <Box mb={50}>
        <Wrapper>
          <Text color="dark" mb={2} ff="Museo Sans" fontSize={6}>
            {t('tokensList.title')}
          </Text>
          <Button small primary onClick={() => null}>
            <Box horizontal flow={1} alignItems="center">
              <IconPlus size={12} />
              <Box>{t('tokensList.cta')}</Box>
            </Box>
          </Button>
        </Wrapper>
        {account.tokenAccounts &&
          account.tokenAccounts.map((token, index) => (
            <TokenRow
              index={index}
              key={token.id}
              range={range}
              account={token}
              parentAccount={account}
              onClick={this.onAccountClick}
            />
          ))}
      </Box>
    )
  }
}

export default compose(
  connect(
    null,
    mapDispatchToProps,
  ),
  translate(),
)(TokensList)

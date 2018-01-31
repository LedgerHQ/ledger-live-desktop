// @flow

import React, { PureComponent, Fragment } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { translate } from 'react-i18next'

import { MODAL_SEND, MODAL_RECEIVE } from 'constants'

import type { MapStateToProps } from 'react-redux'
import type { T, Account, AccountData } from 'types/common'

import { formatBTC } from 'helpers/format'

import { getAccountById, getAccountData } from 'reducers/accounts'
import { openModal } from 'reducers/modals'

import Box, { Card } from 'components/base/Box'
import Button from 'components/base/Button'
import Icon from 'components/base/Icon'
import ReceiveBox from 'components/ReceiveBox'
import Text from 'components/base/Text'
import TransactionsList from 'components/TransactionsList'

type Props = {
  t: T,
  account: Account,
  accountData: AccountData,
  openModal: Function,
}

const mapStateToProps: MapStateToProps<*, *, *> = (state, props) => ({
  account: getAccountById(state, props.match.params.id),
  accountData: getAccountData(state, props.match.params.id),
})

const mapDispatchToProps = {
  openModal,
}

class AccountPage extends PureComponent<Props> {
  render() {
    const { account, accountData, openModal, t } = this.props

    return (
      <Box flow={3}>
        <Box horizontal>
          <Box>
            <Text fontSize={4}>{`${account.name} account`}</Text>
          </Box>
          <Box horizontal align="center" justify="flex-end" grow flow={20}>
            <Box>
              <Button primary onClick={() => openModal(MODAL_SEND, { account })}>
                <Box horizontal flow={2} align="center">
                  <Box>
                    <Icon name="upload" />
                  </Box>
                  <Box>{t('send.title')}</Box>
                </Box>
              </Button>
            </Box>
            <Box>
              <Button primary onClick={() => openModal(MODAL_RECEIVE, { account })}>
                <Box horizontal flow={2} align="center">
                  <Box>
                    <Icon name="download" />
                  </Box>
                  <Box>{t('receive.title')}</Box>
                </Box>
              </Button>
            </Box>
            <Box>
              <Button icon="sliders-h" />
            </Box>
          </Box>
        </Box>
        {accountData && (
          <Fragment>
            <Box horizontal flow={3}>
              <Box grow>
                <Card title="Balance" style={{ height: 435 }} align="center" justify="center">
                  <Text fontSize={5}>{formatBTC(accountData.balance)}</Text>
                </Card>
              </Box>

              <Box style={{ width: 300 }}>
                <Card title="Receive" flow={3}>
                  <ReceiveBox address={accountData.address} />
                </Card>
              </Box>
            </Box>
            <Card title="Last operations">
              <TransactionsList transactions={accountData.transactions} />
            </Card>
          </Fragment>
        )}
      </Box>
    )
  }
}

export default compose(connect(mapStateToProps, mapDispatchToProps), translate())(AccountPage)

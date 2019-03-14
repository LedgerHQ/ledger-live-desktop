// @flow

import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'
import type { T } from 'types/common'

import Box from 'components/base/Box'
import Text from 'components/base/Text'
import AccountsOrder from './AccountsOrder'
import ExportOperationsBtn from '../ExportOperationsBtn'

type Props = {
  t: T,
  accountsLength: number,
}

class AccountCardListHeader extends PureComponent<Props> {
  render() {
    const { accountsLength, t } = this.props

    return (
      <Box horizontal alignItems="center">
        <Text color="dark" ff="Museo Sans" fontSize={6} data-e2e="dashboard_AccountCount">
          {t('dashboard.accounts.title', { count: accountsLength })}
        </Text>
        <Box ml={4}>
          <AccountsOrder />
        </Box>
        <Box ml="auto" horizontal flow={1}>
          <ExportOperationsBtn />
        </Box>
      </Box>
    )
  }
}

export default translate()(AccountCardListHeader)

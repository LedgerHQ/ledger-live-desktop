//  @flow
import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import type { AccountLike, Account } from '@ledgerhq/live-common/lib/types'
import { Trans } from 'react-i18next'
import { useDelegation } from '@ledgerhq/live-common/lib/families/tezos/bakers'

import { openURL } from 'helpers/linking'
import { urls } from 'config/urls'

import { openModal } from 'reducers/modals'

import Text from 'components/base/Text'
import Box from 'components/base/Box'
import Card from 'components/base/Box/Card'
import Button from 'components/base/Button'
import LinkWithExternalIcon from 'components/base/LinkWithExternalIcon'

import IconChartLine from 'icons/ChartLine'

import Header from './Header'
import Row from './Row'

type Props = {
  account: AccountLike,
  parentAccount: ?Account,
  openModal: (name: string, opts: *) => void,
}

const Wrapper = styled(Box).attrs(() => ({
  p: 3,
  mt: 24,
  mb: 6,
}))`
  border: 1px dashed ${p => p.theme.colors.palette.text.shade20};
  border-radius: 4px;
  justify-content: space-between;
  align-items: center;
`

const Delegation = ({ account, parentAccount, openModal }: Props) => {
  const delegation = useDelegation(account)

  return account.type === 'ChildAccount' && !delegation ? null : (
    <>
      <Box horizontal alignItems="center">
        <Text
          ff="Inter|Medium"
          fontSize={6}
          color="palette.text.shade100"
          data-e2e="title_Delegation"
        >
          <Trans i18nKey="delegation.header" />
        </Text>
      </Box>
      {delegation ? (
        <Card p={0} mt={24} mb={6}>
          <Header />
          <Row delegation={delegation} account={account} parentAccount={parentAccount} />
        </Card>
      ) : (
        <Wrapper horizontal>
          <Box>
            <Text ff="Inter|Medium" color="palette.text.shade60" fontSize={3}>
              <Trans i18nKey="delegation.delegationEarn" />
            </Text>
            <Box mt={2}>
              <LinkWithExternalIcon
                label={<Trans i18nKey="delegation.howItWorks" />}
                onClick={() => openURL(urls.delegation)}
              />
            </Box>
          </Box>
          <Box>
            <Button
              primary
              onClick={() => {
                openModal('MODAL_DELEGATE', {
                  parentAccount,
                  account,
                  stepId: 'summary',
                })
              }}
            >
              <Box horizontal flow={1} alignItems="center">
                <IconChartLine size={12} />
                <Box>
                  <Trans i18nKey="delegation.title" />
                </Box>
              </Box>
            </Button>
          </Box>
        </Wrapper>
      )}
    </>
  )
}

export default connect(
  null,
  { openModal },
)(Delegation)

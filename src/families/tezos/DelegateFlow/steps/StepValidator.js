// @flow
import invariant from 'invariant'
import React, { useCallback } from 'react'
import styled from 'styled-components'
import { Trans } from 'react-i18next'
import { getAccountBridge } from '@ledgerhq/live-common/lib/bridge'
import { useBakers } from '@ledgerhq/live-common/lib/families/tezos/bakers'
import type { Baker } from '@ledgerhq/live-common/lib/families/tezos/bakers'
import bakersWhitelistDefault from '@ledgerhq/live-common/lib/families/tezos/bakers.whitelist-default'

import TrackPage from 'analytics/TrackPage'

import Box from 'components/base/Box'
import Text from 'components/base/Text'
import Button from 'components/base/Button'

import UserPlusIcon from 'icons/UserPlus'

import type { StepProps } from '../types'
import BakerImage from '../../BakerImage'

const ScrollList = styled(Box)`
  max-height: 225px;
  overflow-y: scroll;
`

const Row = styled(Box).attrs(() => ({
  horizontal: true,
}))`
  cursor: pointer;
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 4px;
  border: 1px solid ${p => p.theme.colors.palette.text.shade20};
  justify-content: space-between;
  align-items: center;
  transition: box-shadow 250ms ease-out;

  &:hover {
    box-shadow: 0 2px 4px 0 ${p => p.theme.colors.palette.text.shade10};
  }

  &:active {
    background-color: ${p => p.theme.colors.palette.action.active};
  }

  &:last-child {
    margin-bottom: 0;
  }
`

const BakerRow = ({ baker, onClick }: { baker: Baker, onClick: Baker => void }) => (
  <Row onClick={() => onClick(baker)}>
    <Box horizontal alignItems="center">
      <BakerImage baker={baker} size={24} />
      <Text
        ff="Inter|SemiBold"
        fontSize={3}
        color="palette.text.shade100"
        style={{ marginLeft: 8 }}
      >
        {baker.name}
      </Text>
    </Box>
    <Text ff="Inter|SemiBold" fontSize={3} color="palette.text.shade100">
      {baker.nominalYield}
    </Text>
  </Row>
)

export default ({
  account,
  parentAccount,
  transaction,
  transitionTo,
  onChangeTransaction,
}: StepProps) => {
  invariant(account, 'account is required')
  const bakers = useBakers(bakersWhitelistDefault)
  const onBakerClick = useCallback(
    baker => {
      onChangeTransaction(
        getAccountBridge(account, parentAccount).updateTransaction(transaction, {
          recipient: baker.address,
        }),
      )
      transitionTo('summary')
    },
    [account, onChangeTransaction, parentAccount, transaction, transitionTo],
  )
  return (
    <Box flow={4} mx={40}>
      <TrackPage category="Delegation Flow" name="Step Validator" />
      <Box>
        <Text ff="Inter|Regular" color="palette.text.shade80" fontSize={4} align="center">
          <Trans i18nKey="delegation.flow.steps.validator.description" />
        </Text>
      </Box>
      <Box my={24}>
        <Box mb={3} horizontal justifyContent="space-between">
          <Text ff="Inter|Medium" fontSize={3} color="palette.text.shade60">
            <Trans i18nKey="delegation.validator" />
          </Text>
          <Text ff="Inter|Medium" fontSize={3} color="palette.text.shade60">
            <Trans i18nKey="delegation.yield" />
          </Text>
        </Box>
        <ScrollList>
          {bakers.map(baker => (
            <BakerRow baker={baker} key={baker.name} onClick={onBakerClick} />
          ))}
        </ScrollList>
      </Box>
      <Box>
        <Button>
          <Box horizontal flow={1} alignItems="center">
            <UserPlusIcon size={24} />
            <Box>
              <Trans i18nKey="delegation.flow.steps.validator.customValidator" />
            </Box>
          </Box>
        </Button>
      </Box>
    </Box>
  )
}

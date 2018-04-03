// @flow

import React from 'react'
import type { Account } from '@ledgerhq/wallet-common/lib/types'

import type { T } from 'types/common'

import { ModalFooter } from 'components/base/Modal'
import Box from 'components/base/Box'
import Label from 'components/base/Label'
import FormattedVal from 'components/base/FormattedVal'
import Button from 'components/base/Button'
import Text from 'components/base/Text'

type Props = {
  t: T,
  account: Account,
  amount: { left: number, right: number },
  onNext: Function,
  canNext: boolean,
  counterValue: string,
}

function Footer({ account, amount, t, onNext, canNext, counterValue }: Props) {
  return (
    <ModalFooter horizontal alignItems="center">
      <Box grow>
        <Label>{t('send:totalSpent')}</Label>
        <Box horizontal flow={2} align="center">
          <FormattedVal
            disableRounding
            color="dark"
            val={amount.left}
            unit={account.unit}
            showCode
          />
          <Box horizontal align="center">
            <Text ff="Rubik" fontSize={3}>
              {'('}
            </Text>
            <FormattedVal
              disableRounding
              color="grey"
              fontSize={3}
              val={amount.right}
              fiat={counterValue}
              showCode
            />
            <Text ff="Rubik" fontSize={3}>
              {')'}
            </Text>
          </Box>
        </Box>
      </Box>
      <Button primary onClick={onNext} disabled={!canNext}>
        {'Next'}
      </Button>
    </ModalFooter>
  )
}

export default Footer

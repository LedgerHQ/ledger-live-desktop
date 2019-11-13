// @flow

import React from 'react'
import { Trans } from 'react-i18next'
import type { TokenCurrency } from '@ledgerhq/live-common/lib/types'
import Text from 'components/base/Text'
import Box from 'components/base/Box'

const TokenTips: React$ComponentType<{ token: TokenCurrency }> = React.memo(({ token }) => (
  <Box mt={4} horizontal alignItems="center">
    <Text
      style={{ flex: 1, marginLeft: 10 }}
      ff="Inter|Regular"
      color="palette.text.shade80"
      fontSize={3}
    >
      <Trans
        i18nKey="receive.steps.connectDevice.tokensTip"
        values={{ currency: token.parentCurrency.name, token: token.name }}
      />
    </Text>
  </Box>
))

export default TokenTips

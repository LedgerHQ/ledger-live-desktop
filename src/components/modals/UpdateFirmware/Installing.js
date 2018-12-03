// @flow
import React, { Fragment } from 'react'
import { translate } from 'react-i18next'

import Box from 'components/base/Box'
import Text from 'components/base/Text'
import Spinner from 'components/base/Spinner'

import type { T } from 'types/common'

type Props = {
  t: T,
}

function Installing({ t }: Props) {
  return (
    <Fragment>
      <Box mx={7} align="center">
        <Spinner color="fog" size={44} />
      </Box>
      <Box mx={7} mt={4} mb={2}>
        <Text ff="Museo Sans|Regular" align="center" color="dark" fontSize={6}>
          {t('manager.modal.installing')}
        </Text>
      </Box>
      <Box mx={7} mt={4} mb={7}>
        <Text ff="Open Sans|Regular" align="center" color="graphite" fontSize={4}>
          {t('manager.modal.mcuPin')}
        </Text>
      </Box>
    </Fragment>
  )
}

export default translate()(Installing)

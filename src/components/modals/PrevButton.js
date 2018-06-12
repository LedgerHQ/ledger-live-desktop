// @flow

import React from 'react'
import { translate } from 'react-i18next'
import styled from 'styled-components'

import type { T } from 'types/common'

import Button from 'components/base/Button'
import Box from 'components/base/Box'

import IconAngleLeft from 'icons/AngleLeft'

const Wrapper = styled(Button).attrs({
  fontSize: 4,
  ml: 4,
})`
  left: 0;
  margin-top: -18px;
  position: absolute;
  top: 50%;
`

type Props = {
  t: T,
}

const PrevButton = ({ t, ...props }: Props) => (
  <Wrapper {...props}>
    <Box horizontal alignItems="center">
      <IconAngleLeft size={16} />
      {t('app:common.back')}
    </Box>
  </Wrapper>
)

export default translate()(PrevButton)

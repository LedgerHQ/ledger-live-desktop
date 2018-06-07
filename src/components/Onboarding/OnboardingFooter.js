// @flow

import React from 'react'
import styled from 'styled-components'
import { radii } from 'styles/theme'

import type { T } from 'types/common'

import Button from 'components/base/Button'
import Box from 'components/base/Box'

const Wrapper = styled(Box).attrs({
  px: 5,
  py: 3,
})`
  border-top: 1px solid ${p => p.theme.colors.lightFog};
  border-bottom-left-radius: ${radii[1]}px;
  border-bottom-right-radius: ${radii[1]}px;
`

type Props = {
  t: T,
  nextStep: () => void,
  prevStep: () => void,
  jumpStep?: string => void,
  jumpTo?: string,
  isContinueDisabled?: boolean,
}

const OnboardingFooter = ({
  t,
  nextStep,
  prevStep,
  isContinueDisabled,
  jumpStep,
  jumpTo,
  ...props
}: Props) => (
  <Wrapper {...props}>
    <Button padded outline onClick={() => prevStep()}>
      {t('common:back')}
    </Button>
    <Button
      padded
      disabled={isContinueDisabled}
      primary
      onClick={() => (jumpTo && jumpStep ? jumpStep(jumpTo) : nextStep())}
      ml="auto"
    >
      {t('common:continue')}
    </Button>
  </Wrapper>
)
export default OnboardingFooter

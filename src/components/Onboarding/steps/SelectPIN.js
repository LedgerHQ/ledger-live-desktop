// @flow

import React from 'react'

import Box from 'components/base/Box'
import { colors } from 'styles/theme'

import IconSelectPIN from 'icons/onboarding/SelectPIN'
import IconChevronRight from 'icons/ChevronRight'

import {
  Title,
  Description,
  Inner,
  OptionRow,
  IconOptionRow,
  DisclaimerBox,
} from '../helperComponents'
import OnboardingFooter from '../OnboardingFooter'

import type { StepProps } from '..'

export default (props: StepProps) => {
  const { nextStep, prevStep, t } = props
  const steps = [
    {
      key: 'step1',
      icon: <IconOptionRow>1.</IconOptionRow>,
      desc: t('onboarding:selectPIN.instructions.step1'),
    },
    {
      key: 'step2',
      icon: <IconOptionRow>2.</IconOptionRow>,
      desc: t('onboarding:selectPIN.instructions.step2'),
    },
    {
      key: 'step3',
      icon: <IconOptionRow>3.</IconOptionRow>,
      desc: t('onboarding:selectPIN.instructions.step3'),
    },
    {
      key: 'step4',
      icon: <IconOptionRow>4.</IconOptionRow>,
      desc: t('onboarding:selectPIN.instructions.step4'),
    },
  ]
  const disclaimerNotes = [
    {
      key: 'note1',
      icon: <IconChevronRight size={12} style={{ color: colors.smoke }} />,
      desc: t('onboarding:selectPIN.disclaimer.note1'),
    },
    {
      key: 'note2',
      icon: <IconChevronRight size={12} style={{ color: colors.smoke }} />,
      desc: t('onboarding:selectPIN.disclaimer.note2'),
    },
    {
      key: 'note3',
      icon: <IconChevronRight size={12} style={{ color: colors.smoke }} />,
      desc: t('onboarding:selectPIN.disclaimer.note3'),
    },
  ]
  return (
    <Box sticky>
      <Box grow alignItems="center" justifyContent="center">
        <Box align="center" mb={5}>
          <Title>{t('onboarding:selectPIN.title')}</Title>
          <Description style={{ maxWidth: 527 }}>{t('onboarding:selectPIN.desc')}</Description>
        </Box>
        <Box align="center">
          <Inner style={{ width: 760 }}>
            <Box style={{ width: 260 }} mt={5}>
              <IconSelectPIN />
            </Box>

            <Box shrink grow flow={4}>
              {steps.map(step => <OptionRow key={step.key} step={step} />)}
            </Box>
          </Inner>
          <DisclaimerBox disclaimerNotes={disclaimerNotes} />
        </Box>
      </Box>
      <OnboardingFooter
        horizontal
        align="center"
        flow={2}
        t={t}
        nextStep={nextStep}
        prevStep={prevStep}
      />
    </Box>
  )
}

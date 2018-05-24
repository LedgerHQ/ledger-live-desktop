// @flow

import React from 'react'

import Box from 'components/base/Box'
import IconWriteSeed from 'icons/onboarding/WriteSeed'
import IconChevronRight from 'icons/ChevronRight'
import { colors } from 'styles/theme'

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
      desc: t('onboarding:writeSeed.instructions.step1'),
    },
    {
      key: 'step2',
      icon: <IconOptionRow>2.</IconOptionRow>,
      desc: t('onboarding:writeSeed.instructions.step2'),
    },
    {
      key: 'step3',
      icon: <IconOptionRow>3.</IconOptionRow>,
      desc: t('onboarding:writeSeed.instructions.step3'),
    },
  ]
  const disclaimerNotes = [
    {
      key: 'note1',
      icon: <IconChevronRight size={12} style={{ color: colors.smoke }} />,
      desc: t('onboarding:writeSeed.disclaimer.note1'),
    },
    {
      key: 'note2',
      icon: <IconChevronRight size={12} style={{ color: colors.smoke }} />,
      desc: t('onboarding:writeSeed.disclaimer.note2'),
    },
    {
      key: 'note3',
      icon: <IconChevronRight size={12} style={{ color: colors.smoke }} />,
      desc: t('onboarding:writeSeed.disclaimer.note3'),
    },
  ]
  return (
    <Box sticky pt={150}>
      <Box grow alignItems="center">
        <Box align="center" mb={5}>
          <Title>{t('onboarding:writeSeed.title')}</Title>
          <Description style={{ maxWidth: 714 }}>{t('onboarding:writeSeed.desc')}</Description>
        </Box>
        <Box align="center">
          <Inner style={{ width: 760 }}>
            <Box style={{ width: 260, alignItems: 'center' }}>
              <IconWriteSeed />
            </Box>
            <Box shrink grow flow={4}>
              {steps.map(step => <OptionRow key={step.key} step={step} />)}
            </Box>
          </Inner>
          <DisclaimerBox mt={6} disclaimerNotes={disclaimerNotes} />
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

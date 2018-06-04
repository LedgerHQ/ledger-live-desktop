// @flow

import React from 'react'

import Box from 'components/base/Box'
import IconWriteSeed from 'icons/illustrations/WriteSeed'
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
    {
      key: 'step4',
      icon: <IconOptionRow>4.</IconOptionRow>,
      desc: t('onboarding:writeSeed.instructions.step4'),
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
    {
      key: 'note4',
      icon: <IconChevronRight size={12} style={{ color: colors.smoke }} />,
      desc: t('onboarding:writeSeed.disclaimer.note4'),
    },
  ]
  return (
    <Box sticky pt={170}>
      <Box grow alignItems="center">
        <Box mb={3}>
          <Title>{t('onboarding:writeSeed.title')}</Title>
          <Description>{t('onboarding:writeSeed.desc')}</Description>
        </Box>
        <Box align="center">
          <Inner style={{ width: 760 }}>
            <Box style={{ width: 260, justifyContent: 'center', alignItems: 'center' }}>
              <IconWriteSeed />
            </Box>
            <Box shrink flow={2} m={0}>
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

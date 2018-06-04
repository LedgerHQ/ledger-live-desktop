// @flow

import React, { Fragment } from 'react'

import Box from 'components/base/Box'
import { colors } from 'styles/theme'

import IconLedgerNanoSelectPIN from 'icons/illustrations/LedgerNanoSelectPIN'
import IconLedgerBlueSelectPIN from 'icons/illustrations/LedgerBlueSelectPIN'
import IconChevronRight from 'icons/ChevronRight'

import { Title, Inner, OptionRow, IconOptionRow, DisclaimerBox } from '../helperComponents'
import OnboardingFooter from '../OnboardingFooter'

import type { StepProps } from '..'

// TODO: adjust for different wording based on the flow type when we have wording
export default (props: StepProps) => {
  const { nextStep, prevStep, t, onboarding } = props
  const stepsLedgerNano = [
    {
      key: 'step1',
      icon: <IconOptionRow>1.</IconOptionRow>,
      desc: t('onboarding:selectPIN.instructions.ledgerNano.step1'),
    },
    {
      key: 'step2',
      icon: <IconOptionRow>2.</IconOptionRow>,
      desc: t('onboarding:selectPIN.instructions.ledgerNano.step2'),
    },
    {
      key: 'step3',
      icon: <IconOptionRow>3.</IconOptionRow>,
      desc: t('onboarding:selectPIN.instructions.ledgerNano.step3'),
    },
    {
      key: 'step4',
      icon: <IconOptionRow>4.</IconOptionRow>,
      desc: t('onboarding:selectPIN.instructions.ledgerNano.step4'),
    },
  ]

  const stepsLedgerBlue = [
    {
      key: 'step1',
      icon: <IconOptionRow>1.</IconOptionRow>,
      desc: t('onboarding:selectPIN.instructions.ledgerBlue.step1'),
    },
    {
      key: 'step2',
      icon: <IconOptionRow>2.</IconOptionRow>,
      desc: t('onboarding:selectPIN.instructions.ledgerBlue.step2'),
    },
    {
      key: 'step3',
      icon: <IconOptionRow>3.</IconOptionRow>,
      desc: t('onboarding:selectPIN.instructions.ledgerBlue.step3'),
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
    <Box sticky pt={170}>
      <Box grow alignItems="center">
        <Title>{t('onboarding:selectPIN.title')}</Title>
        <Box align="center" mt={7}>
          {onboarding.isLedgerNano ? (
            <Fragment>
              <Inner style={{ width: 700 }}>
                <Box style={{ width: 260, justifyContent: 'center', alignItems: 'center' }} mt={5}>
                  <IconLedgerNanoSelectPIN />
                </Box>

                <Box shrink grow flow={4}>
                  {stepsLedgerNano.map(step => <OptionRow key={step.key} step={step} />)}
                </Box>
              </Inner>
            </Fragment>
          ) : (
            <Fragment>
              <Inner style={{ width: 700 }}>
                <Box style={{ width: 260, justifyContent: 'center', alignItems: 'center' }} mt={2}>
                  <IconLedgerBlueSelectPIN />
                </Box>

                <Box shrink grow flow={4}>
                  {stepsLedgerBlue.map(step => <OptionRow key={step.key} step={step} />)}
                </Box>
              </Inner>
            </Fragment>
          )}
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

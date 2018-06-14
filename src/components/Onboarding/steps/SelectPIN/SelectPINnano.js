// @flow
import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'
import { colors } from 'styles/theme'

import Box from 'components/base/Box'

import type { T } from 'types/common'
import IconLedgerNanoSelectPIN from 'icons/illustrations/LedgerNanoSelectPIN'

import IconChevronRight from 'icons/ChevronRight'

import { IconOptionRow, DisclaimerBox, OptionRow, Inner } from '../../helperComponents'

type Props = {
  t: T,
}

class SelectPINnano extends PureComponent<Props, *> {
  render() {
    const { t } = this.props

    const stepsLedgerNano = [
      {
        key: 'step1',
        icon: <IconOptionRow>1.</IconOptionRow> /* eslint-disable-line react/jsx-no-literals */,
        desc: t('onboarding:selectPIN.instructions.ledgerNano.step1'),
      },
      {
        key: 'step2',
        icon: <IconOptionRow>2.</IconOptionRow> /* eslint-disable-line react/jsx-no-literals */,
        desc: t('onboarding:selectPIN.instructions.ledgerNano.step2'),
      },
      {
        key: 'step3',
        icon: <IconOptionRow>3.</IconOptionRow> /* eslint-disable-line react/jsx-no-literals */,
        desc: t('onboarding:selectPIN.instructions.ledgerNano.step3'),
      },
      {
        key: 'step4',
        icon: <IconOptionRow>4.</IconOptionRow> /* eslint-disable-line react/jsx-no-literals */,
        desc: t('onboarding:selectPIN.instructions.ledgerNano.step4'),
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
      <Box align="center" mt={3}>
        <Inner style={{ width: 700 }}>
          <IconLedgerNanoSelectPIN />
          <Box shrink grow flow={4} style={{ marginLeft: 40 }}>
            {stepsLedgerNano.map(step => <OptionRow key={step.key} step={step} />)}
          </Box>
        </Inner>
        <DisclaimerBox mt={6} disclaimerNotes={disclaimerNotes} />
      </Box>
    )
  }
}

export default translate()(SelectPINnano)

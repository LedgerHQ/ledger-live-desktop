// @flow
import React from 'react'
import { translate, Trans } from 'react-i18next'
import { i } from 'helpers/staticPath'

import InvertableImg from 'components/InvertableImg'
import Box from 'components/base/Box'
import Text from 'components/base/Text'

import type { T } from 'types/common'

import IconChevronRight from 'icons/ChevronRight'

import { getDeviceModel } from '@ledgerhq/devices'
import { IconOptionRow, DisclaimerBox, OptionRow, Inner } from '../../helperComponents'
import { restoreConfiguration } from '../../../../config/nontranslatables'

type Props = {
  t: T,
}

const SelectPINrestoreBlue = ({ t }: Props) => {
  const stepsLedgerBlue = [
    {
      key: 'step1',
      icon: <IconOptionRow>{'1.'}</IconOptionRow>,
      desc: t('onboarding.selectPIN.restore.instructions.blue.step1', getDeviceModel('blue')),
    },
    {
      key: 'step2',
      icon: <IconOptionRow>{'2.'}</IconOptionRow>,
      desc: (
        <Box style={{ display: 'block' }}>
          <Trans i18nKey="onboarding.selectPIN.restore.instructions.blue.step2">
            {'Tap on'}
            <Text ff="Inter|SemiBold" color="palette.text.shade100">
              {{ restoreConfiguration }}
            </Text>
          </Trans>
        </Box>
      ),
    },
    {
      key: 'step3',
      icon: <IconOptionRow>{'3.'}</IconOptionRow>,
      desc: t('onboarding.selectPIN.restore.instructions.blue.step3'),
    },
  ]

  const disclaimerNotes = [
    {
      key: 'note1',
      icon: <IconChevronRight size={12} />,
      desc: t('onboarding.selectPIN.disclaimer.note1'),
    },
    {
      key: 'note2',
      icon: <IconChevronRight size={12} />,
      desc: t('onboarding.selectPIN.disclaimer.note2'),
    },
    {
      key: 'note3',
      icon: <IconChevronRight size={12} />,
      desc: t('onboarding.selectPIN.disclaimer.note3'),
    },
  ]

  return (
    <Box align="center">
      <Inner style={{ width: 550 }}>
        <Box style={{ width: 180, justifyContent: 'center', alignItems: 'center' }}>
          <InvertableImg alt="" src={i('select-pin-blue-onb.svg')} />
        </Box>
        <Box>
          <Box shrink grow flow={4}>
            {stepsLedgerBlue.map(step => (
              <OptionRow key={step.key} step={step} />
            ))}
          </Box>
        </Box>
      </Inner>
      <DisclaimerBox mt={6} disclaimerNotes={disclaimerNotes} color="palette.text.shade80" />
    </Box>
  )
}

export default translate()(SelectPINrestoreBlue)

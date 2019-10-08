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
import { setUpAsNewDevice } from '../../../../config/nontranslatables'

type Props = {
  t: T,
}

const SelectPINnanoX = ({ t }: Props) => {
  const stepsLedgerNano = [
    {
      key: 'step1',
      icon: <IconOptionRow>{'1.'}</IconOptionRow>,
      desc: t('onboarding.selectPIN.initialize.instructions.nanoX.step1', getDeviceModel('nanoX')),
    },
    {
      key: 'step2',
      icon: <IconOptionRow>{'2.'}</IconOptionRow>,
      desc: (
        <Box style={{ display: 'block' }}>
          <Trans i18nKey="onboarding.selectPIN.initialize.instructions.nanoX.step2">
            {'Press both buttons to choose'}
            <Text ff="Inter|SemiBold" color="palette.text.shade100">
              {setUpAsNewDevice}
            </Text>
          </Trans>
        </Box>
      ),
    },
    {
      key: 'step3',
      icon: <IconOptionRow>{'3.'}</IconOptionRow>,
      desc: t('onboarding.selectPIN.initialize.instructions.nanoX.step3'),
    },
    {
      key: 'step4',
      icon: <IconOptionRow>{'4.'}</IconOptionRow>,
      desc: t('onboarding.selectPIN.initialize.instructions.nanoX.step4'),
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
    <Box align="center" mt={3}>
      <Inner style={{ width: 700 }}>
        <InvertableImg alt="" src={i('select-pin-nano-x-onb.svg')} />
        <Box shrink grow flow={4} style={{ marginLeft: 40 }}>
          {stepsLedgerNano.map(step => (
            <OptionRow key={step.key} step={step} />
          ))}
        </Box>
      </Inner>
      <DisclaimerBox mt={6} disclaimerNotes={disclaimerNotes} color="palette.text.shade80" />
    </Box>
  )
}

export default translate()(SelectPINnanoX)

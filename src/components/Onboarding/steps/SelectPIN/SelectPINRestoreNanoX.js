// @flow
import React, { PureComponent } from 'react'
import { Trans, translate } from 'react-i18next'
import { i } from 'helpers/staticPath'

import InvertableImg from 'components/InvertableImg'
import Box from 'components/base/Box'
import Text from 'components/base/Text'

import type { T } from 'types/common'

import IconChevronRight from 'icons/ChevronRight'

import { getDeviceModel } from '@ledgerhq/devices'
import { IconOptionRow, DisclaimerBox, OptionRow, Inner } from '../../helperComponents'
import { restoreConfiguration, setUpAsNewDevice } from '../../../../config/nontranslatables'

type Props = {
  t: T,
}

class SelectPINrestoreNanoX extends PureComponent<Props, *> {
  render() {
    const { t } = this.props
    const device = getDeviceModel('nanoX')

    const stepsLedgerNano = [
      {
        key: 'step1',
        icon: <IconOptionRow>{'1.'}</IconOptionRow>,
        desc: t('onboarding.selectPIN.restore.instructions.nanoX.step1', device),
      },
      {
        key: 'step2',
        icon: <IconOptionRow>{'2.'}</IconOptionRow>,
        desc: t('onboarding.selectPIN.restore.instructions.nanoX.step2', device),
      },
      {
        key: 'step3',
        icon: <IconOptionRow>{'3.'}</IconOptionRow>,
        desc: (
          <Box style={{ display: 'block' }}>
            <Trans i18nKey="onboarding.selectPIN.restore.instructions.nanoX.step3">
              {'Press the left button to cancel'}
              <Text ff="Inter|SemiBold" color="palette.text.shade100">
                {setUpAsNewDevice}
              </Text>
            </Trans>
          </Box>
        ),
      },
      {
        key: 'step4',
        icon: <IconOptionRow>{'4.'}</IconOptionRow>,
        desc: (
          <Box style={{ display: 'block' }}>
            <Trans i18nKey="onboarding.selectPIN.restore.instructions.nanoX.step4">
              {'Press the left button to cancel'}
              <Text ff="Inter|SemiBold" color="palette.text.shade100">
                {restoreConfiguration}
              </Text>
            </Trans>
          </Box>
        ),
      },
      {
        key: 'step5',
        icon: <IconOptionRow>{'5.'}</IconOptionRow>,
        desc: t('onboarding.selectPIN.restore.instructions.nanoX.step5'),
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
}

export default translate()(SelectPINrestoreNanoX)

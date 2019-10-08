// @flow
import React, { PureComponent, Fragment } from 'react'
import { translate, Trans } from 'react-i18next'
import { i } from 'helpers/staticPath'
import type { T } from 'types/common'

import InvertableImg from 'components/InvertableImg'
import Box from 'components/base/Box'
import Text from 'components/base/Text'
import IconChevronRight from 'icons/ChevronRight'

import {
  Title,
  Description,
  IconOptionRow,
  DisclaimerBox,
  OptionRow,
  Inner,
} from '../../helperComponents'
import { seedConfirmation, seedNext } from '../../../../config/nontranslatables'

type Props = {
  t: T,
}

class WriteSeedBlue extends PureComponent<Props, *> {
  render() {
    const { t } = this.props

    const steps = [
      {
        key: 'step1',
        icon: <IconOptionRow>{'1.'}</IconOptionRow>,
        desc: t('onboarding.writeSeed.initialize.blue.step1'),
      },
      {
        key: 'step2',
        icon: <IconOptionRow>{'2.'}</IconOptionRow>,
        desc: (
          <Box style={{ display: 'block' }}>
            <Trans i18nKey="onboarding.writeSeed.initialize.blue.step2">
              {'Tap'}
              <Text ff="Inter|SemiBold" color="palette.text.shade100">
                {{ seedNext }}
              </Text>
              {'to move to the next words. Repeat the process until the'}
              <Text ff="Inter|SemiBold" color="palette.text.shade100">
                {{ seedConfirmation }}
              </Text>
              {'screen appears.'}
            </Trans>
          </Box>
        ),
      },
      {
        key: 'step3',
        icon: <IconOptionRow>{'3.'}</IconOptionRow>,
        desc: t('onboarding.writeSeed.initialize.blue.step3'),
      },
    ]
    const disclaimerNotes = [
      {
        key: 'note1',
        icon: <IconChevronRight size={12} />,
        desc: t('onboarding.writeSeed.disclaimer.note1'),
      },
      {
        key: 'note2',
        icon: <IconChevronRight size={12} />,
        desc: t('onboarding.writeSeed.disclaimer.note2'),
      },
      {
        key: 'note3',
        icon: <IconChevronRight size={12} />,
        desc: t('onboarding.writeSeed.disclaimer.note3'),
      },
      {
        key: 'note4',
        icon: <IconChevronRight size={12} />,
        desc: t('onboarding.writeSeed.disclaimer.note4'),
      },
    ]

    return (
      <Fragment>
        <Box mb={3}>
          <Title>{t('onboarding.writeSeed.initialize.title')}</Title>
          <Description>{t('onboarding.writeSeed.initialize.desc')}</Description>
        </Box>
        <Box align="center">
          <Inner style={{ width: 760 }}>
            <Box style={{ width: 260, justifyContent: 'center', alignItems: 'center' }}>
              <InvertableImg alt="" src={i('write-seed-onb.svg')} />
            </Box>
            <Box shrink flow={2} m={0}>
              {steps.map(step => (
                <OptionRow key={step.key} step={step} />
              ))}
            </Box>
          </Inner>
          <DisclaimerBox mt={6} disclaimerNotes={disclaimerNotes} color="palette.text.shade80" />
        </Box>
      </Fragment>
    )
  }
}

export default translate()(WriteSeedBlue)

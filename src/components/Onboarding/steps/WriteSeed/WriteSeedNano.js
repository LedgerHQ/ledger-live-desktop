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
import { seedWord1 } from '../../../../config/nontranslatables'

type Props = {
  t: T,
}

class WriteSeedNano extends PureComponent<Props, *> {
  render() {
    const { t } = this.props

    const steps = [
      {
        key: 'step1',
        icon: <IconOptionRow>{'1.'}</IconOptionRow>,
        desc: (
          <Box style={{ display: 'block' }}>
            <Trans i18nKey="onboarding.writeSeed.initialize.nano.step1">
              {'Copy the word displayed below'}
              <Text ff="Inter|SemiBold" color="palette.text.shade100">
                {{ seedWord1 }}
              </Text>
              {'in position 1 on a blank Recovery sheet.'}
            </Trans>
          </Box>
        ),
      },
      {
        key: 'step2',
        icon: <IconOptionRow>{'2.'}</IconOptionRow>,
        desc: (
          <Box style={{ display: 'block' }}>
            <Trans i18nKey="onboarding.writeSeed.initialize.nano.step2">
              {'Press the right button to continue and write down all 24 words.'}
            </Trans>
          </Box>
        ),
      },
      {
        key: 'step3',
        icon: <IconOptionRow>{'3.'}</IconOptionRow>,
        desc: t('onboarding.writeSeed.initialize.nano.step3'),
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
        <Box align="center" mt={3}>
          <Inner style={{ width: 700 }}>
            <Box style={{ width: 300 }} justifyContent="center" alignItems="center">
              <InvertableImg alt="" src={i('write-seed-onb.svg')} />
            </Box>

            <Box shrink grow flow={4}>
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

export default translate()(WriteSeedNano)

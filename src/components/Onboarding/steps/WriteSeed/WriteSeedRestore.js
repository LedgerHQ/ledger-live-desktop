// @flow
import React, { PureComponent, Fragment } from 'react'
import { translate, Trans } from 'react-i18next'
import { i } from 'helpers/staticPath'

import InvertableImg from 'components/InvertableImg'
import Box from 'components/base/Box'
import Text from 'components/base/Text'

import type { T } from 'types/common'
import type { OnboardingState } from 'reducers/onboarding'

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
  onboarding: OnboardingState,
}

class WriteSeedRestore extends PureComponent<Props, *> {
  render() {
    const { t, onboarding } = this.props

    const stepsNano = [
      {
        key: 'step1',
        icon: <IconOptionRow>{'1.'}</IconOptionRow>,
        desc: t('onboarding.writeSeed.restore.nano.step1'),
      },
      {
        key: 'step2',
        icon: <IconOptionRow>{'2.'}</IconOptionRow>,
        desc: (
          <Box style={{ display: 'block' }}>
            <Trans i18nKey="onboarding.writeSeed.restore.nano.step2">
              {'Select the first letters of'}
              <Text ff="Inter|SemiBold" color="palette.text.shade100">
                {{ seedWord1 }}
              </Text>
              {'by pressing the right or left button. Press both buttons to confirm each letter.'}
            </Trans>
          </Box>
        ),
      },
      {
        key: 'step3',
        icon: <IconOptionRow>{'3.'}</IconOptionRow>,
        desc: (
          <Box style={{ display: 'block' }}>
            <Trans i18nKey="onboarding.writeSeed.restore.nano.step3">
              {'Select'}
              <Text ff="Inter|SemiBold" color="palette.text.shade100">
                {{ seedWord1 }}
              </Text>
              {'from the suggested words. Press both buttons to continue.'}
            </Trans>
          </Box>
        ),
      },
      {
        key: 'step4',
        icon: <IconOptionRow>{'4.'}</IconOptionRow>,
        desc: t('onboarding.writeSeed.restore.nano.step4'),
      },
    ]
    const stepsBlue = [
      {
        key: 'step1',
        icon: <IconOptionRow>{'1.'}</IconOptionRow>,
        desc: t('onboarding.writeSeed.restore.blue.step1'),
      },
      {
        key: 'step2',
        icon: <IconOptionRow>{'2.'}</IconOptionRow>,
        desc: t('onboarding.writeSeed.restore.blue.step2'),
      },
      {
        key: 'step3',
        icon: <IconOptionRow>{'3.'}</IconOptionRow>,
        desc: t('onboarding.writeSeed.restore.blue.step3'),
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
          <Title>{t('onboarding.writeSeed.restore.title')}</Title>
          <Description>{t('onboarding.writeSeed.restore.desc')}</Description>
        </Box>
        <Box align="center">
          <Inner style={{ width: 760 }}>
            <Box style={{ width: 260, justifyContent: 'center', alignItems: 'center' }}>
              <InvertableImg alt="" src={i('write-seed-onb.svg')} />
            </Box>
            {onboarding.deviceModelId === 'nanoS' ? (
              <Box shrink flow={2} m={0}>
                {stepsNano.map(step => (
                  <OptionRow key={step.key} step={step} />
                ))}
              </Box>
            ) : (
              <Box shrink flow={2} m={0}>
                {stepsBlue.map(step => (
                  <OptionRow key={step.key} step={step} />
                ))}
              </Box>
            )}
          </Inner>
          <DisclaimerBox mt={6} disclaimerNotes={disclaimerNotes} color="palette.text.shade80" />
        </Box>
      </Fragment>
    )
  }
}

export default translate()(WriteSeedRestore)

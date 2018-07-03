// @flow
import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'
import ReactMarkdown from 'react-markdown'
import styled from 'styled-components'
import network from 'api/network'

import { MODAL_TECHNICAL_DATA } from 'config/constants'
import Modal, { ModalBody, ModalTitle, ModalContent, ModalFooter } from 'components/base/Modal'

import Button from 'components/base/Button'
import Box from 'components/base/Box'
import GrowScroll from 'components/base/GrowScroll'
import Text from 'components/base/Text'
import Spinner from 'components/base/Spinner'
import GradientBox from 'components/GradientBox'
import IconChevronRight from 'icons/ChevronRight'
import { OptionRow } from 'components/Onboarding/helperComponents'

import type { T } from 'types/common'

const Title = styled(Text).attrs({
  ff: 'Museo Sans',
  fontSize: 5,
  color: 'dark',
})``

type Props = {
  t: T,
}

class TechnicalData extends PureComponent<Props, *> {
  render() {
    const { t } = this.props

    const steps = [
      {
        key: 'item1',
        desc: t('onboarding:analytics.technicalData.mandatoryContextual.item1'),
      },
      {
        key: 'item2',
        desc: t('onboarding:analytics.technicalData.mandatoryContextual.item2'),
      },
      {
        key: 'item3',
        desc: t('onboarding:analytics.technicalData.mandatoryContextual.item3'),
      },
      {
        key: 'item4',
        desc: t('onboarding:analytics.technicalData.mandatoryContextual.item4'),
      },
      {
        key: 'item5',
        desc: t('onboarding:analytics.technicalData.mandatoryContextual.item5'),
      },
      {
        key: 'item6',
        desc: t('onboarding:analytics.technicalData.mandatoryContextual.item6'),
      },
    ]

    return (
      <Modal
        name={MODAL_TECHNICAL_DATA}
        render={({ onClose }) => (
          <ModalBody onClose={onClose}>
            <ModalTitle>{t('onboarding:analytics.technicalData.title')}</ModalTitle>
            <InlineDesc>{t('onboarding:analytics.technicalData.desc')}</InlineDesc>
            <ModalContent mx={5}>
              <Ul>{steps.map(step => <li key={step.key}>{step.desc}</li>)}</Ul>
            </ModalContent>
            <ModalFooter horizontal justifyContent="flex-end">
              <Button onClick={onClose} primary>
                Close
              </Button>
            </ModalFooter>
          </ModalBody>
        )}
      />
    )
  }
}

export default translate()(TechnicalData)

export const Ul = styled.ul.attrs({
  ff: 'Open Sans|Regular',
})`
  margin-top: 15px;
  font-size: 13px;
  color: ${p => p.theme.colors.graphite};
  line-height: 1.69;
`
export const InlineDesc = styled(Box).attrs({
  ff: 'Open Sans|SemiBold',
  fontSize: 4,
  color: 'dark',
  mx: '45px',
})``

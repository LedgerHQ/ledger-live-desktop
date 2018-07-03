// @flow
import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'
import styled from 'styled-components'

import { MODAL_REPORT_BUGS } from 'config/constants'
import Modal, { ModalBody, ModalTitle, ModalContent, ModalFooter } from 'components/base/Modal'

import Button from 'components/base/Button'
import Box from 'components/base/Box'
import Text from 'components/base/Text'

import type { T } from 'types/common'

const Title = styled(Text).attrs({
  ff: 'Museo Sans',
  fontSize: 5,
  color: 'dark',
})``

type Props = {
  t: T,
}
class ReportBugs extends PureComponent<Props, *> {
  render() {
    const { t } = this.props
    const steps = [
      {
        key: 'item1',
        desc: t('onboarding:analytics.sentryLogs.mandatoryContextual.item1'),
      },
      {
        key: 'item2',
        desc: t('onboarding:analytics.sentryLogs.mandatoryContextual.item2'),
      },
      {
        key: 'item3',
        desc: t('onboarding:analytics.sentryLogs.mandatoryContextual.item3'),
      },
      {
        key: 'item4',
        desc: t('onboarding:analytics.sentryLogs.mandatoryContextual.item4'),
      },
      {
        key: 'item5',
        desc: t('onboarding:analytics.sentryLogs.mandatoryContextual.item5'),
      },
      {
        key: 'item6',
        desc: t('onboarding:analytics.sentryLogs.mandatoryContextual.item6'),
      },
      {
        key: 'item7',
        desc: t('onboarding:analytics.sentryLogs.mandatoryContextual.item7'),
      },
      {
        key: 'item8',
        desc: t('onboarding:analytics.sentryLogs.mandatoryContextual.item8'),
      },
      {
        key: 'item9',
        desc: t('onboarding:analytics.sentryLogs.mandatoryContextual.item9'),
      },
      {
        key: 'item10',
        desc: t('onboarding:analytics.sentryLogs.mandatoryContextual.item10'),
      },
    ]
    return (
      <Modal
        name={MODAL_REPORT_BUGS}
        render={({ onClose }) => (
          <ModalBody onClose={onClose}>
            <ModalTitle>{t('onboarding:analytics.sentryLogs.title')}</ModalTitle>
            <InlineDesc>{t('onboarding:analytics.sentryLogs.desc')}</InlineDesc>
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

export default translate()(ReportBugs)

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

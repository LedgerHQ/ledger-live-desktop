// @flow
import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'

import { MODAL_TECHNICAL_DATA } from 'config/constants'
import Modal, { ModalBody, ModalTitle, ModalContent, ModalFooter } from 'components/base/Modal'
import Button from 'components/base/Button'

import type { T } from 'types/common'
import { Ul, InlineDesc } from './ShareAnalytics'

type Props = {
  t: T,
}

class TechnicalData extends PureComponent<Props, *> {
  render() {
    const { t } = this.props

    const items = [
      {
        key: 'item1',
        desc: t('app:onboarding.analytics.technicalData.mandatoryContextual.item1'),
      },
      {
        key: 'item2',
        desc: t('app:onboarding.analytics.technicalData.mandatoryContextual.item2'),
      },
      {
        key: 'item3',
        desc: t('app:onboarding.analytics.technicalData.mandatoryContextual.item3'),
      },
      {
        key: 'item4',
        desc: t('app:onboarding.analytics.technicalData.mandatoryContextual.item4'),
      },
      {
        key: 'item5',
        desc: t('app:onboarding.analytics.technicalData.mandatoryContextual.item5'),
      },
    ]

    return (
      <Modal
        name={MODAL_TECHNICAL_DATA}
        render={({ onClose }) => (
          <ModalBody onClose={onClose}>
            <ModalTitle data-e2e="modal_title_TechData">
              {t('app:onboarding.analytics.technicalData.mandatoryContextual.title')}
            </ModalTitle>
            <InlineDesc>{t('app:onboarding.analytics.technicalData.desc')}</InlineDesc>
            <ModalContent mx={5}>
              <Ul>{items.map(item => <li key={item.key}>{item.desc}</li>)}</Ul>
            </ModalContent>
            <ModalFooter horizontal justifyContent="flex-end">
              <Button onClick={onClose} primary data-e2e="modal_buttonClose_techData">
                {t('app:common.close')}
              </Button>
            </ModalFooter>
          </ModalBody>
        )}
      />
    )
  }
}

export default translate()(TechnicalData)

// @flow
import React, { PureComponent } from 'react'
import { translate } from 'react-i18next'
import styled from 'styled-components'

import { MODAL_SHARE_ANALYTICS } from 'config/constants'
import Modal, { ModalBody, ModalTitle, ModalContent, ModalFooter } from 'components/base/Modal'

import Button from 'components/base/Button'
import Box from 'components/base/Box'

import type { T } from 'types/common'

type Props = {
  t: T,
}
class ShareAnalytics extends PureComponent<Props, *> {
  render() {
    const { t } = this.props
    const items = [
      {
        key: 'item1',
        desc: t('onboarding:analytics.shareAnalytics.mandatoryContextual.item1'),
      },
      {
        key: 'item2',
        desc: t('onboarding:analytics.shareAnalytics.mandatoryContextual.item2'),
      },
      {
        key: 'item3',
        desc: t('onboarding:analytics.shareAnalytics.mandatoryContextual.item3'),
      },
      {
        key: 'item4',
        desc: t('onboarding:analytics.shareAnalytics.mandatoryContextual.item4'),
      },
      {
        key: 'item5',
        desc: t('onboarding:analytics.shareAnalytics.mandatoryContextual.item5'),
      },
      {
        key: 'item6',
        desc: t('onboarding:analytics.shareAnalytics.mandatoryContextual.item6'),
      },
      {
        key: 'item7',
        desc: t('onboarding:analytics.shareAnalytics.mandatoryContextual.item7'),
      },
      {
        key: 'item8',
        desc: t('onboarding:analytics.shareAnalytics.mandatoryContextual.item8'),
      },
      {
        key: 'item9',
        desc: t('onboarding:analytics.shareAnalytics.mandatoryContextual.item9'),
      },
      {
        key: 'item10',
        desc: t('onboarding:analytics.shareAnalytics.mandatoryContextual.item10'),
      },
    ]
    return (
      <Modal
        name={MODAL_SHARE_ANALYTICS}
        render={({ onClose }) => (
          <ModalBody onClose={onClose}>
            <ModalTitle>{t('onboarding:analytics.shareAnalytics.title')}</ModalTitle>
            <InlineDesc>{t('onboarding:analytics.shareAnalytics.desc')}</InlineDesc>
            <ModalContent mx={5}>
              <Ul>{items.map(item => <li key={item.key}>{item.desc}</li>)}</Ul>
            </ModalContent>
            <ModalFooter horizontal justifyContent="flex-end">
              <Button onClick={onClose} primary>
                {t('app:common.close')}
              </Button>
            </ModalFooter>
          </ModalBody>
        )}
      />
    )
  }
}

export default translate()(ShareAnalytics)

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

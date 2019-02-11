// @flow
import React, { Fragment, PureComponent } from 'react'
import { translate } from 'react-i18next'
import styled from 'styled-components'

import { MODAL_SHARE_ANALYTICS } from 'config/constants'
import Modal from 'components/base/Modal'

import Button from 'components/base/Button'
import Box from 'components/base/Box'
import { connect } from 'react-redux'
import { compose } from 'redux'
import type { T } from 'types/common'

import { closeModal } from '../../reducers/modals'
import ModalBody from '../base/Modal/ModalBody'

type Props = {
  t: T,
  closeModal: string => void,
}
const mapDispatchToProps = {
  closeModal,
}

class ShareAnalytics extends PureComponent<Props, *> {
  onClose = () => this.props.closeModal(MODAL_SHARE_ANALYTICS)
  render() {
    const { t } = this.props
    const items = [
      {
        key: 'item1',
        desc: t('onboarding.analytics.shareAnalytics.mandatoryContextual.item1'),
      },
      {
        key: 'item2',
        desc: t('onboarding.analytics.shareAnalytics.mandatoryContextual.item2'),
      },
      {
        key: 'item3',
        desc: t('onboarding.analytics.shareAnalytics.mandatoryContextual.item3'),
      },
      {
        key: 'item4',
        desc: t('onboarding.analytics.shareAnalytics.mandatoryContextual.item4'),
      },
      {
        key: 'item5',
        desc: t('onboarding.analytics.shareAnalytics.mandatoryContextual.item5'),
      },
      {
        key: 'item6',
        desc: t('onboarding.analytics.shareAnalytics.mandatoryContextual.item6'),
      },
      {
        key: 'item7',
        desc: t('onboarding.analytics.shareAnalytics.mandatoryContextual.item7'),
      },
      {
        key: 'item8',
        desc: t('onboarding.analytics.shareAnalytics.mandatoryContextual.item8'),
      },
      {
        key: 'item9',
        desc: t('onboarding.analytics.shareAnalytics.mandatoryContextual.item9'),
      },
    ]
    return (
      <Modal name={MODAL_SHARE_ANALYTICS} centered>
        <ModalBody
          onClose={this.onClose}
          title={t('onboarding.analytics.shareAnalytics.title')}
          render={() => (
            <Fragment>
              <InlineDesc>{t('onboarding.analytics.shareAnalytics.desc')}</InlineDesc>
              <Box mx={5}>
                <Ul>{items.map(item => <li key={item.key}>{item.desc}</li>)}</Ul>
              </Box>
            </Fragment>
          )}
          renderFooter={() => (
            <Fragment>
              <Button onClick={this.onClose} primary data-e2e="modal_buttonClose_shareAnalytics">
                {t('common.close')}
              </Button>
            </Fragment>
          )}
        />
      </Modal>
    )
  }
}

export default compose(
  connect(
    null,
    mapDispatchToProps,
  ),
  translate(),
)(ShareAnalytics)

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
  mx: '15px',
})``

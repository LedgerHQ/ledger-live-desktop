// @flow
import React, { Fragment, PureComponent } from 'react'
import { translate } from 'react-i18next'

import { MODAL_TECHNICAL_DATA } from 'config/constants'
import Modal, { ModalBody } from 'components/base/Modal'
import Button from 'components/base/Button'

import type { T } from 'types/common'
import { connect } from 'react-redux'
import { compose } from 'redux'
import Box from 'components/base/Box'
import { Ul, InlineDesc } from './ShareAnalytics'
import { closeModal } from '../../reducers/modals'

type Props = {
  t: T,
  closeModal: string => void,
}

const mapDispatchToProps = {
  closeModal,
}

class TechnicalData extends PureComponent<Props, *> {
  render() {
    const { t } = this.props

    const items = [
      {
        key: 'item1',
        desc: t('onboarding.analytics.technicalData.mandatoryContextual.item1'),
      },
      {
        key: 'item2',
        desc: t('onboarding.analytics.technicalData.mandatoryContextual.item2'),
      },
      {
        key: 'item3',
        desc: t('onboarding.analytics.technicalData.mandatoryContextual.item3'),
      },
    ]

    return (
      <Modal name={MODAL_TECHNICAL_DATA} centered>
        <ModalBody
          title={t('onboarding.analytics.technicalData.mandatoryContextual.title')}
          render={() => (
            <Fragment>
              <InlineDesc>{t('onboarding.analytics.technicalData.desc')}</InlineDesc>
              <Box mx={5}>
                <Ul>{items.map(item => <li key={item.key}>{item.desc}</li>)}</Ul>
              </Box>
            </Fragment>
          )}
          renderFooter={() => (
            <Fragment>
              <Button
                onClick={() => this.props.closeModal(MODAL_TECHNICAL_DATA)}
                primary
                data-e2e="modal_buttonClose_techData"
              >
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
)(TechnicalData)

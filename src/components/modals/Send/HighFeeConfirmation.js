// @flow
import React, { PureComponent } from 'react'
import { Trans, translate } from 'react-i18next'
import type { T } from 'types/common'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { localeSelector } from 'reducers/settings'
import IconExclamationCircleThin from 'icons/ExclamationCircleThin'
import Box from 'components/base/Box'
import Text from 'components/base/Text'
import { BigNumber } from 'bignumber.js'
import type { Unit } from '@ledgerhq/live-common/lib/types/currencies'
import { formatCurrencyUnit } from '@ledgerhq/live-common/lib/currencies/formatCurrencyUnit'
import ConfirmModal from '../../base/Modal/ConfirmModal'

type Props = {
  t: T,
  isOpened?: boolean,
  fees: BigNumber,
  amount: BigNumber,
  onReject: () => void,
  onAccept: () => void,
  unit: Unit,
  locale: string,
}

class HighFeeConfirmation extends PureComponent<Props, *> {
  render() {
    const { locale, t, onReject, onAccept, fees, amount, unit, isOpened } = this.props

    return (
      <ConfirmModal
        analyticsName="HighFeeModal"
        isDanger={false}
        centered
        narrow
        isOpened={isOpened}
        onReject={onReject}
        onConfirm={onAccept}
        confirmText={t('common.continue')}
        title={t('send.steps.amount.highFeeModal.title')}
        renderIcon={() => (
          <Box color="alertRed" align="center">
            <IconExclamationCircleThin size={43} />
          </Box>
        )}
      >
        <Box>
          <Box
            ff="Inter"
            color="palette.text.shade80"
            fontSize={4}
            pr={20}
            pl={20}
            textAlign="center"
          >
            <Trans i18nKey="send.steps.amount.highFeeModal.desc" parent="div">
              {'Be careful, the transaction fees  ('}
              <Text ff="Inter|SemiBold" color="palette.text.shade100">
                {formatCurrencyUnit(unit, fees, { locale, showCode: true })}
              </Text>
              {'). represent more than 10% of the amount ('}
              <Text ff="Inter|SemiBold" color="palette.text.shade100">
                {formatCurrencyUnit(unit, amount, { locale, showCode: true })}
              </Text>
              {'). Do you want to continue?'}
            </Trans>
          </Box>
        </Box>
      </ConfirmModal>
    )
  }
}

export default translate()(
  connect(
    createStructuredSelector({
      locale: localeSelector,
    }),
  )(HighFeeConfirmation),
)

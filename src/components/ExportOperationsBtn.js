// @flow
import React, { Component } from 'react'
import { compose } from 'redux'
import { translate } from 'react-i18next'
import { connect } from 'react-redux'
import { openModal } from 'reducers/modals'
import styled from 'styled-components'
import Box from 'components/base/Box'
import { MODAL_EXPORT_OPERATIONS } from '../config/constants'
import DownloadCloud from '../icons/DownloadCloud'
import Label from './base/Label'

const mapDispatchToProps = {
  openModal,
}

class ExportOperationsBtn extends Component<{
  t: *,
  openModal: (string, any) => void,
}> {
  render() {
    const { t } = this.props
    return (
      <LabelWrapper onClick={() => this.props.openModal(MODAL_EXPORT_OPERATIONS)}>
        <Box mr={1}>
          <DownloadCloud />
        </Box>
        <span>{t('exportOperationsModal.title')}</span>
      </LabelWrapper>
    )
  }
}

export default compose(
  connect(
    null,
    mapDispatchToProps,
  ),
  translate(),
)(ExportOperationsBtn)

const LabelWrapper = styled(Label).attrs({})`
  &:hover {
    color: ${p => p.theme.colors.wallet};
    cursor: pointer;
  }
  color: ${p => p.theme.colors.wallet};
`

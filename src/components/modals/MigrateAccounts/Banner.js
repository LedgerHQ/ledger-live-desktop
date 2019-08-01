// @flow

import React, { PureComponent } from 'react'
import { Trans } from 'react-i18next'
import { connect } from 'react-redux'
import { openModal } from 'reducers/modals'
import IconMigration from 'icons/Loader'
import { createStructuredSelector } from 'reselect'
import TopBanner, { FakeLink } from '../../TopBanner'
import { someAccountsNeedMigrationSelector } from '../../../reducers/accounts'

class Banner extends PureComponent<{
  someAccountsNeedMigrationSelector: boolean,
  openModal: string => void,
}> {
  render() {
    const { someAccountsNeedMigrationSelector, openModal } = this.props
    return someAccountsNeedMigrationSelector ? (
      <TopBanner
        content={{
          message: <Trans i18nKey="banners.migrate" />,
          Icon: IconMigration,
          right: (
            <FakeLink onClick={() => openModal('MODAL_MIGRATE_ACCOUNTS')}>
              <Trans i18nKey="common.updateNow" />
            </FakeLink>
          ),
        }}
        bannerId={'migrate'}
      />
    ) : null
  }
}

const mapStateToProps = createStructuredSelector({
  someAccountsNeedMigrationSelector,
})

export default connect(
  mapStateToProps,
  { openModal },
)(Banner)

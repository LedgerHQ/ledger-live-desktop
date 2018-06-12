// @flow

import React, { PureComponent, Fragment } from 'react'

import UpdateDownloaded from './UpdateDownloaded'
import UpdateInstalled from './UpdateInstalled'

export default class UpdateNotifier extends PureComponent<{}> {
  render() {
    return (
      <Fragment>
        <UpdateDownloaded />
        <UpdateInstalled />
      </Fragment>
    )
  }
}

// @flow

import React, { Component } from 'react'

import autoUpdate from 'commands/autoUpdate'
import quitAndInstallElectronUpdate from 'commands/quitAndInstallElectronUpdate'

export type UpdateStatus =
  | 'idle'
  | 'checking-for-update'
  | 'update-available'
  | 'update-not-available'
  | 'download-progress'
  | 'update-downloaded'
  | 'checking'
  | 'check-success'
  | 'error'

export type UpdaterContextType = {
  status: UpdateStatus,
  downloadProgress: number,
  quitAndInstall: () => void,
  setStatus: UpdateStatus => void,
  error: ?Error,
}

type UpdaterProviderProps = {
  children: *,
}

type UpdaterProviderState = {
  status: UpdateStatus,
  downloadProgress: number,
  error: ?Error,
}

// $FlowFixMe
const UpdaterContext = React.createContext()

class Provider extends Component<UpdaterProviderProps, UpdaterProviderState> {
  constructor() {
    super()

    if (__PROD__) {
      this.sub = autoUpdate.send({}).subscribe({
        next: e => {
          if (e.status === 'download-progress') {
            const downloadProgress =
              e.payload && e.payload.percent ? e.payload.percent.toFixed(0) : 0
            this.setState({ status: e.status, downloadProgress })
          } else {
            this.setStatus(e.status)
          }
        },
        error: error => this.setState({ status: 'error', error }),
      })
    }

    this.state = {
      status: 'idle',
      downloadProgress: 0,
      error: null,
    }
  }

  componentWillUnmount() {
    if (this.sub) {
      this.sub.unsubscribe()
    }
  }

  sub = null

  setStatus = (status: UpdateStatus) => this.setState({ status })
  setDownloadProgress = (downloadProgress: number) => this.setState({ downloadProgress })
  quitAndInstall = () => quitAndInstallElectronUpdate.send().toPromise()

  render() {
    const { status, downloadProgress, error } = this.state
    const value = {
      status,
      downloadProgress,
      error,
      setStatus: this.setStatus,
      quitAndInstall: this.quitAndInstall,
    }
    return <UpdaterContext.Provider value={value}>{this.props.children}</UpdaterContext.Provider>
  }
}

export const withUpdaterContext = (ComponentToDecorate: React$ComponentType<*>) => (props: *) => (
  <UpdaterContext.Consumer>
    {context => <ComponentToDecorate {...props} context={context} />}
  </UpdaterContext.Consumer>
)

export const UpdaterProvider = Provider

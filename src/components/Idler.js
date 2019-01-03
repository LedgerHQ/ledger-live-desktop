// @flow

import { PureComponent } from 'react'
import { createStructuredSelector } from 'reselect'
import { connect } from 'react-redux'
import { hasPasswordSelector, autoLockTimeoutSelector } from 'reducers/settings'
import debounce from 'lodash/debounce'
import { lock } from 'reducers/application'

type Props = {
  autoLockTimeout: number,
  hasPassword: boolean,
  lock: Function,
}

const mapStateToProps = createStructuredSelector({
  autoLockTimeout: autoLockTimeoutSelector,
  hasPassword: hasPasswordSelector,
})

const mapDispatchToProps = {
  lock,
}

class Idler extends PureComponent<Props> {
  componentDidMount() {
    window.addEventListener('keydown', this.debounceOnChange)
    window.addEventListener('mouseover', this.debounceOnChange)
    this.interval = setInterval(this.checkForAutoLock, 10000)
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.debounceOnChange)
    window.removeEventListener('mouseover', this.debounceOnChange)
    clearInterval(this.interval)
    this.debounceOnChange.cancel()
  }

  interval: IntervalID

  lastAction: number = -1

  idleTimeHandler = () => {
    this.lastAction = Date.now()
  }

  debounceOnChange = debounce(this.idleTimeHandler, 1000, { maxWait: 1000, leading: true })

  checkForAutoLock = _ => {
    const timeout = this.props.autoLockTimeout
    if (this.props.hasPassword && timeout && timeout !== -1) {
      if (Date.now() - (this.lastAction + timeout * 60000) > 0) {
        this.props.lock()
      }
    }
  }

  render() {
    return null
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Idler)

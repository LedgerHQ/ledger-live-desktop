// @flow
import { PureComponent } from 'react'

type Props = {
  callback: () => void,
}

class TriggerOnMount extends PureComponent<Props> {
  componentDidMount() {
    const { callback } = this.props
    callback()
  }
}

export default TriggerOnMount

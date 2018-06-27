import { PureComponent } from 'react'
import { track } from './segment'

class Track extends PureComponent<{
  onMount?: boolean,
  onUnmount?: boolean,
  onUpdate?: boolean,
  event: string,
  properties?: Object,
}> {
  componentDidMount() {
    if (this.props.onMount) this.track()
  }
  componentDidUpdate() {
    if (this.props.onUpdate) this.track()
  }
  componentWillUnmount() {
    if (this.props.onUnmount) this.track()
  }
  track = () => {
    const { event, properties } = this.props
    track(event, properties)
  }
  render() {
    return null
  }
}

export default Track

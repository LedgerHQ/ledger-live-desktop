import { PureComponent } from 'react'
import { page } from './segment'

class TrackPage extends PureComponent<{ category: string, name?: string, properties?: Object }> {
  componentDidMount() {
    const { category, name, properties } = this.props
    page(category, name, properties)
  }
  render() {
    return null
  }
}

export default TrackPage

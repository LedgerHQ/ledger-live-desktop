// @flow

import { PureComponent } from 'react'
import { connect } from 'react-redux'
import { openModal } from 'reducers/modals'
import { isAcceptedTerms } from 'helpers/terms'

type Props = {
  openModal: (string, *) => void,
}

class CheckTermsAccepted extends PureComponent<Props> {
  componentDidMount() {
    if (!isAcceptedTerms()) {
      this.props.openModal('MODAL_TERMS')
    }
  }
  render() {
    return null
  }
}

export default connect(
  null,
  { openModal },
)(CheckTermsAccepted)

import { ff } from 'styles/helpers'

export default props => {
  const prop = props.ff

  if (!prop) {
    return null
  }

  return ff(prop)
}

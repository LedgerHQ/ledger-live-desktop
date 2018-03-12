import styled from 'styled-components'
import { fontSize, color } from 'styled-system'

import fontFamily from 'styles/styled/fontFamily'

export default styled.label.attrs({
  fontSize: 3,
  ff: 'Museo Sans|Regular',
  color: 'grey',
})`
  ${color};
  ${fontSize};
  ${fontFamily};
  display: block;
`

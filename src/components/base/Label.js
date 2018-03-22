import styled from 'styled-components'
import { fontSize, color, alignItems } from 'styled-system'

import fontFamily from 'styles/styled/fontFamily'

export default styled.label.attrs({
  fontSize: 3,
  ff: 'Museo Sans|Regular',
  color: 'grey',
  align: 'center',
})`
  ${alignItems};
  ${color};
  ${fontSize};
  ${fontFamily};
  display: flex;
`

import styled from 'styled-components'
import { fontSize, color, alignItems } from 'styled-system'

import fontFamily from 'styles/styled/fontFamily'

export default styled.label.attrs({
  fontSize: p => p.fontSize || 3,
  ff: p => p.ff || 'Museo Sans|Regular',
  color: p => p.color || 'grey',
  align: 'center',
  display: 'block',
})`
  ${alignItems};
  ${color};
  ${fontSize};
  ${fontFamily};
  display: flex;
`

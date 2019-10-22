import styled from 'styled-components'
import { fontSize, color, alignItems } from 'styled-system'

import fontFamily from 'styles/styled/fontFamily'

export default styled.label.attrs(p => ({
  fontSize: p.fontSize || 3,
  ff: p.ff || 'Inter|Regular',
  color: p.color || 'palette.text.shade60',
  align: 'center',
  display: 'block',
}))`
  margin-top: ${p => (p.mt ? `${p.mt}px` : 'auto')};
  ${alignItems};
  ${color};
  ${fontSize};
  ${fontFamily};
  display: flex;
`

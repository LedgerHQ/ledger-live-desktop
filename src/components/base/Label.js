import styled from 'styled-components'
import { fontSize, color, alignItems } from 'styled-system'

import fontFamily from 'styles/styled/fontFamily'

export default styled.label.attrs(p => ({
  fontSize: p.fontSize || 4,
  ff: p.ff || 'Inter|Medium',
  color: p.color || 'palette.text.shade60',
  align: 'center',
  display: 'block',
}))`
  margin-top: ${p => (p.mt ? `${p.mt}px` : 'auto')};
  margin-bottom: ${p => (p.mb ? `${p.mb}px` : 'auto')};
  ${alignItems};
  ${color};
  ${fontSize};
  ${fontFamily};
  display: flex;
`

import styled from 'styled-components'

const InvertableImg = styled.img`
  filter: invert(${p => (p.theme.colors.palette.type === 'dark' ? '1' : '0')})
    hue-rotate(${p => (p.theme.colors.palette.type === 'dark' ? '180deg' : '0deg')});
`

export default InvertableImg

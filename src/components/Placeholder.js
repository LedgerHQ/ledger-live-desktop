import styled from 'styled-components'

export const PlaceholderLine = styled.div`
  background-color: ${p => (p.dark ? '#C2C2C2' : '#D6D6D6')};
  width: ${p => p.width}px;
  height: ${p => p.height || 10}px;
  border-radius: 5px;
  margin: 5px 0;
`

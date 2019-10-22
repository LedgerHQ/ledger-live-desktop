// @flow
import styled from 'styled-components'

export default styled.div`
  width: 100%;
  height: 60px;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(
    rgba(255, 255, 255, 0),
    ${p => p.theme.colors.palette.background.paper}
  );
  z-index: 2;
  pointer-events: none;
`

// @flow

import styled from 'styled-components'

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  border-top: 2px solid ${p => p.theme.colors.palette.divider};
  padding: 20px;

  &:empty {
    display: none;
  }
`

export default ModalFooter

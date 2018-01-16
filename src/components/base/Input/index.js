import styled from 'styled-components'

export default styled.input`
  padding: 10px 15px;
  border: 1px solid ${p => p.theme.colors.mouse};
  border-radius: 3px;
  display: flex;
  width: 100%;
  color: ${p => p.theme.colors.steel};
  background: ${p => p.theme.colors.white};

  &::placeholder {
    color: ${p => p.theme.colors.mouse};
  }

  &:focus {
    outline: none;
    box-shadow: rgba(0, 0, 0, 0.05) 0 2px 2px;
  }
`

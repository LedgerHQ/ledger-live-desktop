import React, { PureComponent } from 'react'
import styled from 'styled-components'
import IconEye from 'icons/Eye'
import IconEyeOff from 'icons/EyeOff'
import { DiscreetModeContext } from './DiscreetModeWrapper'

const ToggleDiscreetButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

class ToggleDiscreetModeButton extends PureComponent {
  render() {
    return (
      <DiscreetModeContext.Consumer>
        {({ toggleDiscreetMode, discreetMode }) => (
          <ToggleDiscreetButton onClick={() => toggleDiscreetMode(discreetMode)}>
            {discreetMode ? <IconEyeOff size={18} /> : <IconEye size={18} />}
          </ToggleDiscreetButton>
        )}
      </DiscreetModeContext.Consumer>
    )
  }
}

export default ToggleDiscreetModeButton

// @flow

import React from 'react'
import styled from 'styled-components'
import { components } from 'react-select'

import type { OptionProps } from 'react-select/lib/types'

import Box from 'components/base/Box'
import IconCheck from 'icons/Check'
import IconAngleDown from 'icons/AngleDown'
import IconCross from 'icons/Cross'

import type { Option } from './index'

export default ({
  renderOption,
  renderValue,
}: {
  renderOption: Option => Node,
  renderValue: Option => Node,
}) => ({
  ...STYLES_OVERRIDE,
  Option: (props: OptionProps) => {
    const { data, isSelected } = props
    return (
      <components.Option {...props}>
        <Box horizontal pr={4} relative>
          <Box grow>{renderOption ? renderOption(props) : data.label}</Box>
          {isSelected && (
            <CheckContainer color="wallet">
              <IconCheck size={12} color={props.theme.colors.wallet} />
            </CheckContainer>
          )}
        </Box>
      </components.Option>
    )
  },
  SingleValue: (props: OptionProps) => {
    const { data } = props
    return (
      <components.SingleValue {...props}>
        {renderValue ? renderValue(props) : data.label}
      </components.SingleValue>
    )
  },
})

const STYLES_OVERRIDE = {
  DropdownIndicator: (props: OptionProps) => (
    <components.DropdownIndicator {...props}>
      <IconAngleDown size={20} />
    </components.DropdownIndicator>
  ),
  ClearIndicator: (props: OptionProps) => (
    <components.ClearIndicator {...props}>
      <IconCross size={16} />
    </components.ClearIndicator>
  ),
}

const CheckContainer = styled(Box).attrs(() => ({
  align: 'center',
  justify: 'center',
}))`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 10px;
`

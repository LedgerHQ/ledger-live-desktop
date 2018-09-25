// @flow

import React, { PureComponent } from 'react'
import ReactSelect from 'react-select'
import { translate } from 'react-i18next'

import createStyles from './createStyles'
import createRenderers from './createRenderers'

type Props = {
  // required
  value: ?Option,
  options: Option[],
  onChange: (?Option) => void,

  // custom renders
  renderOption: Option => Node,
  renderValue: Option => Node,

  // optional
  placeholder: string,
  isClearable: boolean,
  isDisabled: boolean,
  isRight: boolean,
  isLeft: boolean,
  isLoading: boolean,
  isSearchable: boolean,
  small: boolean,
  width: number,
  minWidth: number,
}

export type Option = {
  value: 'string',
  label: 'string',
  data: any,
}

class Select extends PureComponent<Props> {
  handleChange = (value, { action }) => {
    const { onChange } = this.props
    if (action === 'select-option') {
      onChange(value)
    }
    if (action === 'pop-value') {
      onChange(null)
    }
  }

  render() {
    const {
      value,
      isClearable,
      isSearchable,
      isDisabled,
      isLoading,
      isRight,
      isLeft,
      placeholder,
      options,
      renderOption,
      renderValue,
      width,
      minWidth,
      small,
      ...props
    } = this.props

    return (
      <ReactSelect
        value={value}
        maxMenuHeight={300}
        classNamePrefix="select"
        options={options}
        components={createRenderers({ renderOption, renderValue })}
        styles={createStyles({ width, minWidth, small, isRight, isLeft })}
        placeholder={placeholder}
        isDisabled={isDisabled}
        isLoading={isLoading}
        isClearable={isClearable}
        isSearchable={isSearchable}
        menuPlacement="auto"
        blurInputOnSelect={false}
        backspaceRemovesValue
        menuShouldBlockScroll
        {...props}
        onChange={this.handleChange}
      />
    )
  }
}

export default translate()(Select)

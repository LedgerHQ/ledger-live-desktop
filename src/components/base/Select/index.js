// @flow

import React, { PureComponent } from 'react'
import ReactSelect from 'react-select'
import AsyncReactSelect from 'react-select/lib/Async'
import { translate } from 'react-i18next'
import { FixedSizeList as List } from 'react-window'
import styled from 'styled-components'

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
  async: boolean,
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
  autoFocus: boolean,
}

export type Option = {
  value: 'string',
  label: 'string',
  data: any,
}

const Row = styled.div`
  &:hover {
    background: ${p => p.theme.colors.lightGraphite};
  }
`
const rowHeight = 40 // Fixme We should pass this as a prop for dynamic rows?
class MenuList extends PureComponent<*> {
  render() {
    const { options, children, maxHeight, getValue } = this.props
    const [value] = getValue()
    const initialOffset = options.indexOf(value) * rowHeight
    const minHeight = Math.min(...[maxHeight, rowHeight * children.length])

    children.length &&
      children.map(key => {
        delete key.props.innerProps.onMouseMove // NB: Removes lag on hover, see https://github.com/JedWatson/react-select/issues/3128#issuecomment-433834170
        delete key.props.innerProps.onMouseOver
        return null
      })

    return (
      <List
        width="100%"
        height={minHeight}
        overscanCount={8}
        itemCount={children.length}
        itemSize={rowHeight}
        initialScrollOffset={initialOffset}
      >
        {({ index, style }) => <Row style={style}>{children[index]}</Row>}
      </List>
    )
  }
}
class Select extends PureComponent<Props> {
  componentDidMount() {
    if (this.ref && this.props.autoFocus) {
      // $FlowFixMe
      this.timeout = requestAnimationFrame(() => this.ref.focus())
    }
  }

  componentWillUnmount() {
    if (this.timeout) {
      cancelAnimationFrame(this.timeout)
    }
  }

  handleChange = (value, { action }) => {
    const { onChange } = this.props
    if (action === 'select-option') {
      onChange(value)
    }
    if (action === 'pop-value') {
      onChange(null)
    }
  }

  ref: *
  timeout: *

  render() {
    const {
      async,
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

    const Comp = async ? AsyncReactSelect : ReactSelect

    return (
      <Comp
        ref={c => (this.ref = c)}
        value={value}
        maxMenuHeight={rowHeight * 4.5}
        classNamePrefix="select"
        options={options}
        components={{
          MenuList,
          ...createRenderers({ renderOption, renderValue }),
        }}
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
        menuPortalTarget={document.body}
        {...props}
        onChange={this.handleChange}
      />
    )
  }
}

export default translate()(Select)

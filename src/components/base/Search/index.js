// @flow

import React, { PureComponent, Fragment, createElement } from 'react'
import Fuse from 'fuse.js'

import type { Element } from 'react'

// eslint false positive detection on unused prop-type
type Props = {
  items: Array<Object>, // eslint-disable-line react/no-unused-prop-types
  value: String,
  render: Function,
  highlight?: boolean,
  renderHighlight?: string => Element, // eslint-disable-line react/no-unused-prop-types
  fuseOptions?: Object, // eslint-disable-line react/no-unused-prop-types

  // if true, it will display no items when value is empty
  filterEmpty?: boolean,
}

class Search extends PureComponent<Props> {
  static defaultProps = {
    fuseOptions: {},
    highlight: false,
    filterEmpty: false,
    renderHighlight: chunk => <b>{chunk}</b>,
  }

  state = {
    results: [],
  }

  componentWillMount() {
    this.initFuse(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.value !== this.props.value) {
      this.formatResults(this._fuse.search(nextProps.value), nextProps)
    }
    if (nextProps.highlight !== this.props.highlight) {
      this.initFuse(nextProps)
    }
    if (nextProps.items !== this.props.items) {
      this.initFuse(nextProps)
    }
  }

  initFuse(props) {
    const { fuseOptions, highlight, items, value } = props

    this._fuse = new Fuse(items, {
      ...fuseOptions,
      includeMatches: highlight,
    })

    this.formatResults(this._fuse.search(value), props)
  }

  formatResults(results, props) {
    const { highlight, renderHighlight } = props
    if (highlight) {
      results = results.map(res => {
        let { item } = res
        const { matches } = res

        matches.forEach(match => {
          const { key, value, indices } = match
          let i = 0
          const res = []

          indices.forEach(idx => {
            const [start, end] = idx

            const prefix = value.substring(i, start)
            if (prefix.length > 0) {
              res.push(prefix)
            }

            const v = value.substring(start, end + 1)
            res.push(renderHighlight(v, `${key}-${idx.join(',')}`))

            i = end + 1
          })

          const suffix = value.substring(indices[indices.length - 1][1] + 1)
          if (suffix.length > 0) {
            res.push(suffix)
          }

          const element = createElement(Fragment, {
            key: item[key],
            children: res,
          })

          item = {
            ...item,
            [key]: element,
          }
        })
        return item
      })
    }
    this.setState({ results })
  }

  render() {
    const { render, value, items, filterEmpty } = this.props
    const { results } = this.state
    if (!filterEmpty && value === '') {
      return render(items)
    }
    return render(results)
  }
}

export default Search

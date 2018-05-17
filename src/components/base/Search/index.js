// @flow

import React, { PureComponent, Fragment, createElement } from 'react'
import Fuse from 'fuse.js'

import type FuseType from 'fuse.js'

// eslint false positive detection on unused prop-type
type Props = {
  items: Array<Object>, // eslint-disable-line react/no-unused-prop-types
  value: string,
  render: Function,
  highlight?: boolean,
  renderHighlight?: (string, string) => React$Node, // eslint-disable-line react/no-unused-prop-types
  fuseOptions?: Object, // eslint-disable-line react/no-unused-prop-types

  // if true, it will display no items when value is empty
  filterEmpty?: boolean,
}

type State = {
  results: Array<Object>,
}

class Search extends PureComponent<Props, State> {
  static defaultProps = {
    fuseOptions: {},
    highlight: false,
    filterEmpty: false,
    renderHighlight: (chunk: string): * => <b>{chunk}</b>,
  }

  state = {
    results: [],
  }

  componentWillMount() {
    this.initFuse(this.props)
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.value !== this.props.value) {
      if (this._fuse) {
        const results = this._fuse.search(this.props.value)
        this.formatResults(results, this.props)
      }
    }
    if (prevProps.highlight !== this.props.highlight) {
      this.initFuse(this.props)
    }
    if (prevProps.items !== this.props.items) {
      this.initFuse(this.props)
    }
  }

  _fuse: FuseType<*> | null = null

  initFuse(props: Props) {
    const { fuseOptions, highlight, items, value } = props

    this._fuse = new Fuse(items, {
      ...fuseOptions,
      includeMatches: highlight,
    })

    const results = this._fuse.search(value)
    this.formatResults(results, props)
  }

  formatResults(results: Array<Object>, props: Props) {
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
            if (v && renderHighlight) {
              res.push(renderHighlight(v, `${key}-${idx.join(',')}`))
            }

            i = end + 1
          })

          const suffix = value.substring(indices[indices.length - 1][1] + 1)
          if (suffix.length > 0) {
            res.push(suffix)
          }

          const fragment = createElement(Fragment, {
            key: item[key],
            children: res,
          })

          item = {
            ...item,
            [`${key}_highlight`]: fragment,
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

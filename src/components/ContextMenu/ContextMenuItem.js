// @flow

import React, { PureComponent } from 'react'
import invariant from 'invariant'
import { withContextMenuContext } from './ContextMenuWrapper'
import type { ContextMenuItemType } from './ContextMenuWrapper'
import { DISABLE_CONTEXT_MENU } from '../../config/constants'

type Props = {
  children?: React$Node,
  leftClick?: boolean,
  items: ContextMenuItemType[],
  context: {
    showContextMenu: (event: MouseEvent, items: ContextMenuItemType[]) => void,
  },
}

type State = {
  active: boolean,
}

class ContextMenuItem extends PureComponent<Props, State> {
  componentDidMount() {
    const { items, leftClick } = this.props

    invariant(items, "Don't wrap with ContextMenuWrapper without providing items")

    if (this.ref) {
      if (leftClick) {
        this.ref.addEventListener('click', this.showContextMenu)
      } else if (!DISABLE_CONTEXT_MENU) {
        this.ref.addEventListener('contextmenu', this.showContextMenu)
      }
    }
  }

  componentWillUnmount() {
    const { leftClick } = this.props

    if (this.ref) {
      if (leftClick) {
        this.ref.removeEventListener('click', this.showContextMenu)
      } else if (!DISABLE_CONTEXT_MENU) {
        this.ref.removeEventListener('contextmenu', this.showContextMenu)
      }
    }
  }

  showContextMenu = (event: MouseEvent) => {
    this.props.context.showContextMenu(event, this.props.items)
    event.preventDefault()
    event.stopPropagation()
  }

  ref: *
  render() {
    const { children } = this.props
    return <div ref={c => (this.ref = c)}>{children}</div>
  }
}

export default withContextMenuContext(ContextMenuItem)

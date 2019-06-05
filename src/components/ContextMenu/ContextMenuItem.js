// @flow

import React, { PureComponent } from 'react'
import invariant from 'invariant'
import { withContextMenuContext } from './ContextMenuWrapper'
import type { ContextMenuItemType } from './ContextMenuWrapper'
import { DISABLE_CONTEXT_MENU } from '../../config/constants'

type Props = {
  children?: React$Node,
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
    invariant(this.props.items, "Don't wrap with ContextMenuWrapper without providing items")
    if (!DISABLE_CONTEXT_MENU && this.ref) {
      this.ref.addEventListener('contextmenu', this.showContextMenu)
    }
  }

  componentWillUnmount() {
    if (!DISABLE_CONTEXT_MENU && this.ref) {
      this.ref.removeEventListener('contextmenu', this.showContextMenu)
    }
  }

  showContextMenu = (event: MouseEvent) => {
    this.props.context.showContextMenu(event, this.props.items)
    event.preventDefault()
  }

  ref: *
  render() {
    const { children } = this.props
    return <div ref={c => (this.ref = c)}>{children}</div>
  }
}

export default withContextMenuContext(ContextMenuItem)

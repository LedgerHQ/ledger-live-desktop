// @flow
import { Children } from 'react'

export default ({ children, index }: { children: React$Node, index: number }): ?React$Node =>
  Children.toArray(children)[index] || null

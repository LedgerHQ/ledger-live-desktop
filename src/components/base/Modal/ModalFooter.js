// @flow

import React from 'react'

import { colors } from 'styles/theme'

const MODAL_FOOTER_STYLE = {
  display: 'flex',
  justifyContent: 'flex-end',
  borderTop: `2px solid ${colors.lightGrey}`,
  padding: 20,
}

const ModalFooter = ({ children }: { children: any }) => (
  <div style={MODAL_FOOTER_STYLE}>{children}</div>
)

export default ModalFooter

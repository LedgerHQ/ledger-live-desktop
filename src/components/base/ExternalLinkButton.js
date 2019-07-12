// @flow

import React from 'react'
import { openURL } from 'helpers/linking'

import Button from 'components/base/Button'

export function ExternalLinkButton({ label, url, ...props }: { label: React$Node, url: string }) {
  return (
    <Button onClick={() => openURL(url)} {...props}>
      {label}
    </Button>
  )
}

export default ExternalLinkButton

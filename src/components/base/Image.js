// @flow

/**
 *                                   Image
 *                                   -----
 *  Usage:
 *
 *    <Image
 *      resource="name"   // The asset name located in static/images
 *      themeTyped        // Should I load a contrasted version based on theme type ? (light/dark)
 *      ...Props          // The remaining props will be forwarded to the img
 *    />
 *
 */

import React from 'react'
import useTheme from 'hooks/useTheme'
import { i } from 'helpers/staticPath'
import styled from 'styled-components'
import path from 'path'

type Props = {
  resource: string,
  resourcePath?: string,
  alt: string,
  themeTyped?: boolean,
  className?: string,
}

const Img = styled.img`
  user-select: none;
  pointer-events: none;
`

export default ({ resource, alt, themeTyped = false, resourcePath, className, ...rest }: Props) => {
  const type = useTheme('colors.palette.type')
  const fileName = themeTyped ? `${type}-${resource}` : resource
  const finalPath = resourcePath ? path.join(resourcePath, fileName) : fileName

  return <Img {...rest} alt={alt} className={className} src={i(finalPath)} />
}

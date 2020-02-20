// @flow

/**
 *                                   Image
 *                                   -----
 *  Usage:
 *
 *    <Image
 *      resource=Asset || { dark: Asset1, light: Asset2 }   // The asset
 *      themeTyped        // Should I load a contrasted version based on theme type ? (light/dark)
 *      ...Props          // The remaining props will be forwarded to the img
 *    />
 *
 */

import React from "react";
import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import useTheme from "~/renderer/hooks/useTheme";

type Props = {
  resource: { [string]: string } | string,
  alt: string,
  className?: string,
};

const Img: ThemedComponent<{}> = styled.img`
  user-select: none;
  pointer-events: none;
`;

const Image = ({ resource, alt, className, ...rest }: Props) => {
  const type = useTheme("colors.palette.type");
  const asset = typeof resource === "object" ? resource[type] : resource;

  return <Img {...rest} alt={alt} className={className} src={asset} />;
};

export default Image;

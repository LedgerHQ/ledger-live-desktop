// @flow

import styled from "styled-components";
import {
  fontSize,
  fontWeight,
  textAlign,
  color,
  space,
  lineHeight,
  letterSpacing,
  system,
} from "styled-system";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import fontFamily from "~/renderer/styles/styled/fontFamily";

const uppercase = system({
  uppercase: {
    prop: "uppercase",
    property: "textTransform",
    transform: value => (value ? "uppercase" : "none"),
  },
});

const textTransform = system({
  textTransform: true,
});

const Text: ThemedComponent<{
  fontFamily?: string,
  fontSize?: number | string,
  textAlign?: string,
  color?: string,
  fontWeight?: string,
  mt?: number | string,
  mb?: number | string,
  align?: "DEPRECATED: USE textAlign INSTEAD",
  lineHeight?: string,
}> = styled.span`
  ${uppercase};
  ${p => (p.capitalize ? `text-transform: capitalize;` : "")};
  ${lineHeight};
  ${fontFamily};
  ${fontSize};
  ${textAlign};
  ${color};
  ${fontWeight};
  ${space};
  ${letterSpacing};
  ${textTransform};
`;

export default Text;

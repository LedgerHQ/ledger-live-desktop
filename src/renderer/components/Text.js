// @flow

import styled from "styled-components";
import { fontSize, fontWeight, textAlign, color, space } from "styled-system";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import fontFamily from "~/renderer/styles/styled/fontFamily";

const Text: ThemedComponent<{
  fontFamily?: string,
  fontSize?: number,
  textAlign?: string,
  color?: string,
  fontWeight?: string,
  mt?: number,
  mb?: number,
  align?: "DEPRECATED: USE textAlign INSTEAD",
}> = styled.span`
  ${fontFamily};
  ${fontSize};
  ${textAlign};
  ${color};
  ${fontWeight};
  ${space};
`;

export default Text;

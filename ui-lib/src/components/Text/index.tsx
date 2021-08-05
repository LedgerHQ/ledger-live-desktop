import React from "react";
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
import fontFamily from "@ui/styles/styled/fontFamily";
import "./Text.css";
import BracketRight from "@ui/assets/icons/BracketLeft";
import BracketLeft from "@ui/assets/icons/BracketRight";

const uppercase = system({
  uppercase: {
    property: "textTransform",
    transform: value => (value ? "uppercase" : "none"),
  },
});

type FontFamilies =
  | "Inter|ExtraLight"
  | "Inter|Light"
  | "Inter|Regular"
  | "Inter|Medium"
  | "Inter|SemiBold"
  | "Inter|Bold"
  | "Inter|ExtraBold"
  | "Alpha|Medium";
type TextTypes =
  | "h1"
  | "h2"
  | "h3"
  | "highlight"
  | "emphasis"
  | "body"
  | "cta"
  | "link"
  | "tiny"
  | "subTitle"
  | "navigation"
  | "tag";

export interface TextProps {
  fontFamily?: string;
  ff?: FontFamilies;
  fontSize?: number | string;
  textAlign?: string;
  color?: string;
  fontWeight?: string;
  mt?: number | string;
  mb?: number | string;
  ml?: number | string;
  mr?: number | string;
  lineHeight?: string;
  bracket?: boolean;
  type?: TextTypes;
  children: React.ReactNode;
}

interface BaseTextProps {
  fontFamily?: string;
  ff?: FontFamilies;
  fontSize?: number | string;
  textAlign?: string;
  color?: string;
  fontWeight?: string;
  mt?: number | string;
  mb?: number | string;
  ml?: number | string;
  mr?: number | string;
  lineHeight?: string;
  type?: TextTypes;
}

const Base = styled.span.attrs((p: BaseTextProps) => ({
  color: p.color || "palette.v2.text.default",
  className: `${p.type ? `ll-text_${p.type} ` : ""}`,
}))<BaseTextProps>`
  ${uppercase};
  ${lineHeight};
  ${fontFamily};
  ${fontSize};
  ${textAlign};
  ${color};
  ${fontWeight};
  ${space};
  ${letterSpacing};
`;

const Text = ({ children, bracket, ...props }: TextProps) => {
  return bracket ? (
    <Base {...props}>
      <BracketLeft className="ll-text_bracket" />
      {children}
      <BracketRight className="ll-text_bracket" />
    </Base>
  ) : (
    <Base {...props}>{children}</Base>
  );
};

export default Text;

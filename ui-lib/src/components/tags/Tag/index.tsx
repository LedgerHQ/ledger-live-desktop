import React from "react";
import styled from "styled-components";
import { border, BorderProps, space, SpaceProps, color, ColorProps } from "styled-system";
import Text from "@components/asorted/Text";

export type Props = React.PropsWithChildren<{
  /**
   * Changes the appearance based on the active state.
   */
  active?: boolean;
  /**
   * Tag style.
   */
  type?: "plain" | "opacity" | "outlined";
}>;

function getColor({ type, active }: Props) {
  switch (type) {
    case "opacity":
    case "outlined":
      return "palette.primary.c160";
    default:
      return active ? "palette.neutral.c00" : "palette.primary.c160";
  }
}
function getBgColor({ type, active }: Props) {
  switch (type) {
    case "opacity":
      return active ? "palette.primary.c20" : undefined;
    case "outlined":
      return;
    default:
      return active ? "palette.primary.c160" : undefined;
  }
}

function getBorderColor({ type, active }: Props) {
  if (type === "outlined" && active) {
    return "palette.primary.c160";
  }
}

const TagContainer = styled.div.attrs((props: Props) => ({
  backgroundColor: getBgColor(props),
  borderColor: getBorderColor(props),
  p: "7px", // TODO: use spacing from the theme when it gets updated
}))<Props & BorderProps & SpaceProps & ColorProps>`
  display: inline-flex;
  border: 1px solid transparent;
  border-radius: 4px;
  ${border}
  ${space}
  ${color}
`;

export default function Tag({ children, ...props }: Props): JSX.Element {
  const textColor = getColor(props);
  return (
    <TagContainer {...props}>
      <Text type="tag" color={textColor}>
        {children}
      </Text>
    </TagContainer>
  );
}

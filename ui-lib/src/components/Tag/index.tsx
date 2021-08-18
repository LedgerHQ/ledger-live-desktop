import React from "react";
import styled from "styled-components";
import { border, BorderProps, space, SpaceProps, color, ColorProps } from "styled-system";
import Text from "@components/Text";

export type Props = React.PropsWithChildren<{
  /**
   * Changes the appearance based on the active state.
   */
  active?: boolean;
  /**
   * Tag style.
   */
  type?: "plain" | "translucent" | "outlined";
}>;

function getColor({ type, active }: Props) {
  switch (type) {
    case "translucent":
    case "outlined":
      return "palette.v2.primary.dark";
    default:
      return active ? "palette.v2.background.default" : "palette.v2.primary.dark";
  }
}
function getBgColor({ type, active }: Props) {
  switch (type) {
    case "translucent":
      return active ? "palette.v2.primary.backgroundLight" : undefined;
    case "outlined":
      return;
    default:
      return active ? "palette.v2.primary.dark" : undefined;
  }
}

function getBorderColor({ type, active }: Props) {
  if (type === "outlined" && active) {
    return "palette.v2.primary.dark";
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

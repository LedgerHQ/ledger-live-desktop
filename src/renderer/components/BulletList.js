// @flow
import React from "react";
import styled, { css } from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import Box from "./Box";
import Text from "./Text";

type Props = {
  bullets: string[],
  IconComponent?: React$ComponentType<{ size: number, color?: string }>,
  iconColor?: string,
  centered?: boolean,
};

const Item: ThemedComponent<{ centered: boolean }> = styled.div`
  text-align: center;
  margin-bottom: 6px;
  & > :first-child {
    margin-right: 8px;
  }

  ${p =>
    !p.centered &&
    css`
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      text-align: left;
    `}
`;

const DefaultBullet = styled.div`
  display: inline-flex;
  vertical-align: middle;
  background-color: ${p => p.color || p.theme.colors.palette.primary.main};
  border-radius: 4px;
  align-self: center;
  height: 4px;
  width: 4px;
`;

const BulletList = ({ bullets, IconComponent, iconColor, centered }: Props) => {
  if (!bullets.length) {
    return null;
  }

  return (
    <Box>
      {bullets.map((val, i) => (
        <Item key={`${val}${i}`} centered={!!centered}>
          {IconComponent ? (
            <IconComponent size={16} color={iconColor} />
          ) : (
            <DefaultBullet color={iconColor} />
          )}
          <Text
            ff="Inter|Medium"
            style={{ lineHeight: 1.57, flex: 1 }}
            color="palette.text.shade100"
            fontSize={12}
          >
            {val}
          </Text>
        </Item>
      ))}
    </Box>
  );
};

export default BulletList;

// @flow
import React from "react";
import styled from "styled-components";

import Box from "./Box";
import Text from "./Text";

type Props = {
  bullets: string[],
  IconComponent?: React$ComponentType<{ size: number, color?: string }>,
  iconColor?: string,
};

const Item = styled(Box).attrs(p => ({
  horizontal: true,
  justifyContent: "flex-start",
  alignItems: "center",
  color: p.theme.colors.greenPill,
}))`
  margin-bottom: 6px;
  & > :first-child {
    margin-right: 8px;
  }
`;

const DefaultBullet = styled.div`
  background-color: ${p => p.color || p.theme.colors.palette.primary.main};
  border-radius: 4px;
  align-self: center;
  height: 4px;
  width: 4px;
`;

const BulletList = ({ bullets, IconComponent, iconColor }: Props) => {
  if (!bullets.length) {
    return null;
  }
  return (
    <Box>
      {bullets.map((val, i) => (
        <Item key={`${val}${i}`}>
          {IconComponent ? (
            <IconComponent size={16} color={iconColor} />
          ) : (
            <DefaultBullet color={iconColor} />
          )}
          <Text
            ff="Inter|Medium"
            style={{ lineHeight: 1.57, flex: 1 }}
            color="palette.text.shade100"
            fontSize={13}
          >
            {val}
          </Text>
        </Item>
      ))}
    </Box>
  );
};

export default BulletList;

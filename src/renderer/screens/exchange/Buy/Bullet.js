// @flow

import React from "react";
import styled from "styled-components";
import Text from "~/renderer/components/Text";
import Box from "~/renderer/components/Box";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const Point: ThemedComponent<{}> = styled.span`
  width: 4px;
  height: 4px;
  border-radius: 2px;
  background: ${p => p.theme.colors.palette.primary.main};
  border: 1px solid ${p => p.theme.colors.palette.primary.main};
  margin-right: 8px;
`;

type Props = {
  margin?: string,
  value: string,
};

const Bullet = ({ margin, value }: Props) => {
  return (
    <Box horizontal alignItems="center" mb={margin}>
      <Point />
      <Text ff="Inter|Medium" fontSize={12} color="palette.text.shade70">
        {value}
      </Text>
    </Box>
  );
};

export default Bullet;

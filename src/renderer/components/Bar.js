// @flow

import styled from "styled-components";
import get from "lodash/get";
import Box from "~/renderer/components/Box";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const Bar: ThemedComponent<{
  color?: string,
  size?: number,
}> = styled(Box)`
  background: ${p => get(p.theme.colors, p.color)};
  height: ${p => p.size || 1}px;
  width: 100%;
`;

export default Bar;

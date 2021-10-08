// @flow

import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

export const Separator: ThemedComponent<{}> = styled.div`
  border-top: 1px solid ${p => p.theme.colors.palette.divider};
  ${p => (p.noMargin ? "" : "margin-top: 24px; margin-bottom: 24px;")}
`;

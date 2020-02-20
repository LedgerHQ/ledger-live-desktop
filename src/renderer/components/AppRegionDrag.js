// @flow

import styled from "styled-components";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const AppRegionDrag: ThemedComponent<{}> = styled.div`
  -webkit-app-region: drag;
  height: 40px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
`;

export default AppRegionDrag;

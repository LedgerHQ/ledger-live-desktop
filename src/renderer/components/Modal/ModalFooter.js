// @flow

import styled from "styled-components";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const ModalFooter: ThemedComponent<{}> = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid ${p => p.theme.colors.palette.divider};
  padding: 15px 20px;
  &:empty {
    display: none;
  }
  & > :only-child {
    margin-left: auto;
  }
  > * + * {
    margin-left: 10px;
  }
`;

export default ModalFooter;

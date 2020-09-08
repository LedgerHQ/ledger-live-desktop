// @flow
import styled from "styled-components";

import Text from "~/renderer/components/Text";
import { Base } from "~/renderer/components/Button";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

export const Separator: ThemedComponent<{}> = styled.div`
  &::after {
    content: "/";
    font-size: 13px;
    color: ${p => p.theme.colors.palette.divider};
    padding: 0 15px;
  }
`;

export const Item: ThemedComponent<{ isActive?: boolean }> = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  padding: 12px;
  min-width: 200px;
  color: ${p =>
    p.isActive ? p.theme.colors.palette.text.shade100 : p.theme.colors.palette.text.shade80};
  > :first-child {
    margin-right: 10px;
  }

  > ${Text} {
    flex: 1;
  }

  &:hover {
    background: ${p => p.theme.colors.palette.background.default};
    border-radius: 4px;
  }
`;

export const TextLink: ThemedComponent<{ shrink?: boolean }> = styled.div`
  font-family: 'Inter';
  font-size: 12px;
  align-items: center;
  display: flex;
  flex-direction: row;
  -webkit-app-region: no-drag;
  > :first-child {
    margin-right: 8px;
  }
  ${p => (p.shrink ? "flex-shrink: 1;" : "")}

  > ${Base} {
    text-overflow: ellipsis;
    flex-shrink: 1;
    overflow: hidden;
    padding: 0px;
    &:hover,
    &:active {
      background: transparent;
      text-decoration: underline;
    }
    margin-right: 7px;
  }
`;
export const AngleDown: ThemedComponent<{}> = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 20px;
  text-align: center;
  line-height: 16px;

  &:hover {
    background: ${p => p.theme.colors.palette.divider};
  }
`;

export const Check: ThemedComponent<{}> = styled.div`
  color: ${p => p.theme.colors.wallet};
  align-items: center;
  display: flex;
  text-align: right;
  margin-left: 20px;
`;

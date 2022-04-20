// @flow

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import React from "react";
import styled from "styled-components";
import { GradientHover } from "~/renderer/drawers/OperationDetails/styledComponents";
import CopyWithFeedback from "~/renderer/components/CopyWithFeedback";

const CopiableFieldContainer: ThemedComponent<{}> = styled.div`
  display: inline-flex;
  position: relative;
  max-width: 100%;
  min-width: 12ex;

  ${GradientHover} {
    display: none;
  }

  &:hover ${GradientHover} {
    display: flex;
    & > * {
      cursor: pointer;
    }
  }
`;

type CopiableFieldProps = {
  value: string,
  children?: React$Node,
};

export function CopiableField({ value, children }: CopiableFieldProps) {
  return (
    <CopiableFieldContainer>
      {children}
      <GradientHover>
        <CopyWithFeedback text={value} />
      </GradientHover>
    </CopiableFieldContainer>
  );
}

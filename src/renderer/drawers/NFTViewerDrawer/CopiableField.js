// @flow

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import React from "react";
import styled from "styled-components";
import { GradientHover } from "~/renderer/drawers/OperationDetails/styledComponents";
import CopyWithFeedback from "~/renderer/components/CopyWithFeedback";
import { SplitAddress } from "~/renderer/components/OperationsList/AddressCell";

const CopiableFieldContainer: ThemedComponent<{}> = styled.div`
  display: inline-flex;
  position: relative;
  max-width: 100%;

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

const HashContainer: ThemedComponent<{}> = styled.div`
  word-break: break-all;
  user-select: text;
  width: 100%;
  min-width: 100px;
  user-select: none;
`;

type CopiableFieldProps = {
  value: string,
};

export function CopiableField({ value }: CopiableFieldProps) {
  return (
    <CopiableFieldContainer>
      <HashContainer>
        <SplitAddress value={value} ff="Inter|Regular" />
      </HashContainer>
      <GradientHover>
        <CopyWithFeedback text={value} />
      </GradientHover>
    </CopiableFieldContainer>
  );
}

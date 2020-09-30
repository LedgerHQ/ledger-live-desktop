// @flow

/* eslint-disable react/no-array-index-key */

import React, { PureComponent } from "react";
import styled from "styled-components";

import Box from "~/renderer/components/Box";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

import Step from "./Step";

const Container: ThemedComponent<{}> = styled(Box)`
  position: sticky;
  top: -20px;
  z-index: 2;
`;

const Wrapper: ThemedComponent<{}> = styled(Box).attrs(() => ({
  horizontal: true,
  alignItems: "center",
  justifyContent: "center",
  relative: true,
}))`
  margin-bottom: 25px;
  z-index: 2;
`;

const Bar: ThemedComponent<{
  start: number,
  end: number,
  current: number,
  disabled: ?Array<number>,
}> = styled.div`
  background: ${p => p.theme.colors.palette.text.shade20};
  flex-grow: 1;
  height: 1px;
  left: ${p => p.start}%;
  position: absolute;
  overflow: hidden;
  right: ${p => p.end}%;
  top: 8px;
  z-index: 1;

  &:after,
  &:before {
    bottom: 0;
    content: "";
    display: block;
    left: 0;
    position: absolute;
    right: auto;
    top: 0;
    transition: right ease-in-out 0.4s;
  }

  &:after {
    background: ${p => p.theme.colors.wallet};
    right: ${p => (p.current === 0 ? 0 : `${p.current}%`)};
    z-index: 1;
  }

  &:before {
    background: ${p => p.theme.colors.palette.text.shade20};
    left: ${p => (p.disabled ? `${p.disabled[0]}%` : 0)};
    right: ${p => (p.disabled ? `${p.disabled[1]}%` : "auto")};
    z-index: 2;
  }
`;

const indexToPercent = (index, itemsLength) =>
  100 - (100 / (itemsLength - 1)) * parseInt(index, 10);

type Props = {
  currentStep: number | string,
  items: Array<Object>,
  stepsDisabled: Array<number>,
  stepsErrors: Array<number>,
};

class Breadcrumb extends PureComponent<Props> {
  static defaultProps = {
    stepsDisabled: [],
    stepsErrors: [],
  };

  render() {
    const { items, stepsDisabled, stepsErrors, currentStep, ...props } = this.props;
    const itemsLength = items.length;
    const start = 100 / itemsLength / 2;

    return (
      <Container>
        <Box {...props} bg="palette.background.paper" relative>
          <Wrapper>
            {items
              .filter(i => !i.excludeFromBreadcrumb)
              .map((item, i) => {
                let status = "next";

                const stepIndex = parseInt(currentStep, 10);

                if (i === stepIndex) {
                  status = "active";
                }

                if (i < stepIndex) {
                  status = "valid";
                }

                if (stepsErrors.includes(i)) {
                  status = "error";
                }

                if (stepsDisabled.includes(i)) {
                  status = "disable";
                }

                return (
                  <Step key={i} status={status} number={i + 1}>
                    {item.label}
                  </Step>
                );
              })}
          </Wrapper>
          <Bar
            end={start}
            start={start}
            disabled={
              stepsDisabled.length > 0
                ? [
                    stepsDisabled[0] === 0 ? 0 : indexToPercent(stepsDisabled[0] + 1, itemsLength),
                    indexToPercent(stepsDisabled[stepsDisabled.length - 1], itemsLength),
                  ]
                : null
            }
            current={!currentStep ? 100 : indexToPercent(currentStep, itemsLength)}
          />
        </Box>
      </Container>
    );
  }
}

export default Breadcrumb;

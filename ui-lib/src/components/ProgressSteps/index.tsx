import React, { memo } from "react";
import styled from "styled-components";
import { border, BorderProps, color, ColorProps, space, SpaceProps } from "styled-system";
import CheckAlone from "@ui/assets/icons/CheckAloneMedium";
import CloseMedium from "@ui/assets/icons/CloseMedium";
import Text from "@components/Text";
import Flex from "@components/Layout/Flex";

export interface Props {
  /**
   * An array of labels that will determine the progress bar steps.
   */
  steps: string[];
  /**
   * Index of the active step, starting at zero and defaulting to 0 if omitted.
   */
  activeIndex?: number;
  /**
   * If true the current step is considered as a failure.
   */
  errored?: boolean;
}
/**
 * The state of a progress bar step.
 */
type StepState = "pending" | "current" | "completed" | "errored";
export type StepProps = {
  /**
   * State of the step.
   */
  state: StepState;
  /**
   * The label to display.
   */
  label: string;
  /**
   * If true, hides the left "separator" bar that bridges the gap between the wider separator and the item.
   */
  hideLeftSeparator: boolean;
  /**
   * The next step state, or undefined if the current step is the last one.
   */
  nextState?: StepState;
};

export const Item = {
  Container: styled.div.attrs({
    mx: "8px",
  })<ColorProps & BorderProps & SpaceProps>`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 24px;
    height: 24px;
    ${color}
    ${border}
    ${space}
  `,
  Spacer: styled.div<SpaceProps>`
    display: flex;
    align-self: stretch;
    ${space}
  `,
  Current: styled.div.attrs({
    backgroundColor: "palette.v2.primary.dark",
  })<ColorProps>`
    width: 6px;
    height: 6px;
    border-radius: 6px;
    ${color}
  `,
  Pending: styled.div.attrs({
    backgroundColor: "palette.v2.text.tertiary",
  })<ColorProps>`
    width: 4px;
    height: 4px;
    border-radius: 4px;
    ${color}
  `,
  Completed: (): JSX.Element => <CheckAlone size={16} />,
  Errored: (): JSX.Element => <CloseMedium size={16} />,
};

const StepText = styled(Text)<{ inactive?: boolean; errored?: boolean }>`
  color: ${p =>
    p.errored
      ? p.theme.colors.palette.v2.feedback.error
      : p.inactive
      ? p.theme.colors.palette.v2.text.tertiary
      : p.theme.colors.palette.v2.text.default};
`;

const BaseSeparator = styled.div<{ inactive?: boolean }>`
  flex: 1;
  position: relative;
  overflow-x: hidden;
  background-color: ${p => p.theme.colors.palette.v2.grey.border};
  height: 1px;
  top: 12px;

  &::after {
    content: "";
    position: absolute;
    width: 100%;
    transform: ${p => (p.inactive ? "translateX(calc(-100% - 1px))" : "translateX(0)")};
    transition: 0.25s transform;
    transition-timing-function: linear;
    border-top: 1px solid;
    border-color: ${p => p.theme.colors.palette.v2.text.default};
  }
`;

const Separator = {
  Step: styled(BaseSeparator)`
    &::after {
      transition-delay: 0.1s;
    }
  `,
  Item: styled(BaseSeparator)<{ position: string }>`
    &::after {
      transition-duration: 0.1s;
      transition-delay: ${p =>
        (p.position === "left" && !p.inactive) || (p.position === "right" && p.inactive)
          ? "0.35s"
          : "0s"};
    }
  `,
};

export const Step = memo(function Step({
  state,
  label,
  hideLeftSeparator,
  nextState,
}: StepProps): JSX.Element {
  const inactive = state === "pending";
  const nextInactive = nextState === "pending";
  const errored = state === "errored";
  return (
    <Flex flexDirection="column" alignItems="center">
      <Item.Spacer mb="12px">
        {(!hideLeftSeparator && <Separator.Item inactive={inactive} position="left" />) || (
          <Flex flex="1" />
        )}
        {state === "pending" ? (
          <Item.Container>
            <Item.Pending />
          </Item.Container>
        ) : state === "current" ? (
          <Item.Container backgroundColor="palette.v2.primary.backgroundLight" borderRadius="8px">
            <Item.Current />
          </Item.Container>
        ) : state === "completed" ? (
          <Item.Container
            color="palette.v2.primary.dark"
            backgroundColor="palette.v2.primary.backgroundLight"
            borderRadius="8px"
          >
            <Item.Completed />
          </Item.Container>
        ) : state === "errored" ? (
          <Item.Container
            color="palette.v2.feedback.error"
            backgroundColor="palette.v2.orange.error"
            borderRadius="8px"
          >
            <Item.Errored />
          </Item.Container>
        ) : (
          <></>
        )}
        {(nextState && <Separator.Item inactive={nextInactive} position="right" />) || (
          <Flex flex="1" />
        )}
      </Item.Spacer>
      <StepText inactive={inactive} errored={errored} type="navigation">
        {label}
      </StepText>
    </Flex>
  );
});

function getState(activeIndex: number, index: number, errored?: boolean) {
  return activeIndex < index
    ? "pending"
    : activeIndex === index
    ? errored
      ? "errored"
      : "current"
    : "completed";
}

function ProgressSteps({ steps, activeIndex = 0, errored }: Props) {
  return (
    <Flex flexWrap="nowrap" justifyContent="space-between">
      {steps.map((step, idx) => {
        const state = getState(activeIndex, idx, errored);
        const nextState = idx < steps.length - 1 ? getState(activeIndex, idx + 1) : undefined;
        return (
          <>
            {idx > 0 && <Separator.Step inactive={state === "pending"} />}
            <Step label={step} state={state} nextState={nextState} hideLeftSeparator={idx === 0} />
          </>
        );
      })}
    </Flex>
  );
}

export default memo(ProgressSteps);

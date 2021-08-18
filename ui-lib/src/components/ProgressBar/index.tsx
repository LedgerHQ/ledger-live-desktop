import React, { memo } from "react";
import styled from "styled-components";
import { border, BorderProps, color, ColorProps, space, SpaceProps } from "styled-system";
import CheckAlone from "@ui/assets/icons/CheckAloneMedium";
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
}
/**
 * The state of a progress bar step.
 */
type StepState = "pending" | "current" | "completed";
type StepProps = {
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
  Container: styled.div.attrs(_ => ({
    mx: 2,
  }))<ColorProps & BorderProps & SpaceProps>`
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
  Current: styled.div.attrs(_ => ({
    backgroundColor: "palette.v2.primary.dark",
  }))<ColorProps>`
    width: 6px;
    height: 6px;
    border-radius: 9999px;
    ${color}
  `,
  Pending: styled.div.attrs(_ => ({
    backgroundColor: "palette.v2.text.secondary",
  }))<ColorProps>`
    width: 4px;
    height: 4px;
    border-radius: 9999px;
    ${color}
  `,
  Completed: (): JSX.Element => <CheckAlone size={16} />,
};

const StepText = styled(Text)<{ inactive?: boolean }>`
  color: ${p =>
    p.inactive ? p.theme.colors.palette.v2.text.secondary : p.theme.colors.palette.v2.text.default};
`;

const BaseSeparator = styled.div<{ inactive?: boolean }>`
  border: 1px solid;
  height: 0px;
  border-color: ${p =>
    p.inactive ? p.theme.colors.palette.v2.grey.border : p.theme.colors.palette.v2.text.default};
`;
const Separator = {
  Step: styled(BaseSeparator)`
    flex: 1;
    position: relative;
    top: 12px;
  `,
  Item: styled(BaseSeparator)`
    flex: 1;
    top: 12px;
    position: relative;
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
  return (
    <Flex flexDirection="column" alignItems="center">
      <Item.Spacer mb={2}>
        {(!hideLeftSeparator && <Separator.Item inactive={inactive} />) || <Flex flex="1" />}
        {state === "pending" ? (
          <Item.Container>
            <Item.Pending />
          </Item.Container>
        ) : state === "current" ? (
          <Item.Container backgroundColor="palette.v2.primary.backgroundLight" borderRadius="8px">
            <Item.Current />
          </Item.Container>
        ) : (
          <Item.Container color="palette.v2.text.default">
            <Item.Completed />
          </Item.Container>
        )}
        {(nextState && <Separator.Item inactive={nextInactive} />) || <Flex flex="1" />}
      </Item.Spacer>
      <StepText inactive={inactive} type="subTitle">
        {label}
      </StepText>
    </Flex>
  );
});

function getState(activeIndex: number, index: number) {
  return activeIndex < index ? "pending" : activeIndex === index ? "current" : "completed";
}

function ProgressBar({ steps, activeIndex = 0 }: Props) {
  return (
    <Flex flexWrap="nowrap" justifyContent="space-between">
      {steps.map((step, idx) => {
        const state = getState(activeIndex, idx);
        const nextState = idx < steps.length - 1 ? getState(activeIndex, idx + 1) : undefined;
        return (
          <>
            {idx > 0 ? <Separator.Step inactive={state === "pending"} /> : null}
            <Step label={step} state={state} nextState={nextState} hideLeftSeparator={idx === 0} />
          </>
        );
      })}
    </Flex>
  );
}

export default memo(ProgressBar);

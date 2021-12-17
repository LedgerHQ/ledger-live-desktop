import React, { useCallback } from "react";
import styled from "styled-components";
import debounce from "lodash/debounce";

import { Flex, Button, Text, Icons } from "@ledgerhq/react-ui";

// TODO: maybe this component belongs on the design system
const Container = styled(Flex)`
  border-radius: ${p => p.theme.radii[4]}px;
`;

// TODO: unfortunately I wasn't able to do it only with props of the Button component
// maybe it's not possible without some adaptations in the lib
const SmallButton = styled(Button)`
  height: ${p => p.theme.space[8]}px;
  width: ${p => p.theme.space[8]}px;
`;

const DEBOUNCE_ON_CHANGE = 250;

type Props = {
  max: number;
  min: number;
  onChange: (value: number) => void;
  step?: number;
  value: number;
};

const StepperNumber = ({ max, min, onChange, step = 1, value }: Props) => {
  const debouncedOnChange = useCallback(
    debounce((v: number) => onChange(v), DEBOUNCE_ON_CHANGE),
    [onChange],
  );

  const increment = useCallback(() => {
    const newValue = value + step;

    if (newValue !== value) {
      const isMax = newValue >= max;
      debouncedOnChange(isMax ? max : newValue);
    }
  }, [debouncedOnChange, value, max, step]);

  const decrement = useCallback(() => {
    const newValue = value - step;

    if (newValue !== value) {
      const isMin = newValue <= min;
      debouncedOnChange(isMin ? min : newValue);
    }
  }, [debouncedOnChange, value, min, step]);

  return (
    <Container
      alignItems="center"
      justifyContent="center"
      backgroundColor="neutral.c40"
      display="inline-flex"
      columnGap={4}
      maxHeight={24}
      p={2}
    >
      <SmallButton
        onClick={decrement}
        disabled={value <= min}
        variant="main"
        Icon={Icons.MinusMedium}
        iconSize={12}
      />
      <Text>{value}</Text>
      <SmallButton
        onClick={increment}
        disabled={value >= max}
        variant="main"
        Icon={Icons.PlusMedium}
        iconSize={12}
      />
    </Container>
  );
};

export default StepperNumber;

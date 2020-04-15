// @flow
import React from "react";
import styled from "styled-components";

import type { ThemedComponent } from "../styles/StyleProvider";

import Text from "./Text";

const MainContainer: ThemedComponent<{}> = styled.div`
  display: block;
  width: auto;
  height: 32px;
  position: relative;
`;

const Container: ThemedComponent<{}> = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: start;
  flex-wrap: nowrap;
  width: 100%;
  height: 32px;
  position: relative;
  border: 1px solid ${p => p.theme.colors.palette.primary.main};
  border-radius: 32px;
  overflow: hidden;
`;

const IndicatorContainer: ThemedComponent<{}> = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: start;
  flex-wrap: nowrap;
  width: 100%;
  height: 32px;
  top: 0;
  left: 0;
  position: absolute;
  overflow: hidden;
  border-radius: 32px;
  z-index: 0;
`;

const Indicator: ThemedComponent<{ length: number }> = styled.div.attrs(p => ({
  style: {
    transform: `translateX(${p.activeIndex * 100}%)`,
  },
}))`
  flex: ${p => 1 / p.length};
  height: 32px;
  background-color: ${p => p.theme.colors.palette.primary.main};
  transition: transform 200ms ease-in;
  will-change: transform;
`;

const Label = styled(Text).attrs(p => ({
  ff: "Inter|SemiBold",
  fontSize: 4,
  color: p.active ? "palette.primary.contrastText" : "palette.primary.main",
}))`
  transition: color 100ms 100ms ease-out;
`;

const OptionButton: ThemedComponent<{}> = styled.button`
  flex: 1;
  background-color: transparent;
  border: none;
  z-index: 1;
  cursor: pointer;
  transition: filter 200ms ease-out;
`;

type Props = {
  value: string,
  disabled?: boolean,
  options: Array<{ value: string, label: string | React$Node, disabled?: boolean }>,
  onChange: (value: string) => void,
};

const ToggleButton = ({ value, options, onChange }: Props) => {
  if (!options.length) return null;

  const activeIndex = options.findIndex(opt => opt.value === value);

  return (
    <MainContainer>
      <IndicatorContainer>
        <Indicator length={options.length} activeIndex={activeIndex} />
      </IndicatorContainer>
      <Container>
        {options.map(({ value, label, disabled }, index) => (
          <OptionButton
            key={`ToggleButton_${value}_${index}`}
            disabled={disabled}
            onClick={() => onChange(value)}
          >
            <Label active={activeIndex === index}>{label}</Label>
          </OptionButton>
        ))}
      </Container>
    </MainContainer>
  );
};

export default ToggleButton;

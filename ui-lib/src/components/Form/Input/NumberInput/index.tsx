import React from "react";
import Input, { InputProps } from "@components/Form/Input/BaseInput";
import FlexBox from "@ui/components/Layout/Flex";
import Text from "@ui/components/Text";
import styled from "styled-components";

const MaxButton = styled.button<{ active?: boolean }>`
  color: ${p =>
    p.active ? p.theme.colors.palette.v2.text.contrast : p.theme.colors.palette.v2.text.secondary};
  background-color: ${p =>
    p.active ? p.theme.colors.palette.v2.text.default : p.theme.colors.palette.v2.text.contrast};
  border-radius: 100px;
  border-width: 0;
  height: 31px;
  padding-left: 13px;
  padding-right: 13px;
`;

export default function NumberInput({
  onPercentClick,
  max,
  value,
  disabled,
  ...inputProps
}: InputProps & {
  onPercentClick: (percent: number) => void;
}): JSX.Element {
  return (
    <Input
      {...inputProps}
      value={value}
      max={max}
      disabled={disabled}
      type={"number"}
      renderRight={
        <FlexBox alignItems={"center"} justifyContent={"center"} py={"3px"} mr={"8px"}>
          {[0.25, 0.5, 0.75, 1].map(percent => (
            <MaxButton
              key={percent}
              onClick={() => onPercentClick(percent)}
              active={!!value && !!max && Number(value) === percent * Number(max)}
              disabled={disabled}
            >
              <Text type={"tiny"} color={"inherit"}>
                {percent * 100}%
              </Text>
            </MaxButton>
          ))}
        </FlexBox>
      }
    />
  );
}

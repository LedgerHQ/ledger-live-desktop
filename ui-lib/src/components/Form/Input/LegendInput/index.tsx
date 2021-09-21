import React from "react";
import Input, { InputProps, InputRenderRightContainer } from "@components/Form/Input/BaseInput";
import Text from "@ui/components/Text";

export default function LegendInput({
  legend,
  ...inputProps
}: InputProps & { legend: string }): JSX.Element {
  return (
    <Input
      {...inputProps}
      renderRight={
        <InputRenderRightContainer>
          <Text color={"palette.neutral.c70"} type="body">
            {legend}
          </Text>
        </InputRenderRightContainer>
      }
    />
  );
}

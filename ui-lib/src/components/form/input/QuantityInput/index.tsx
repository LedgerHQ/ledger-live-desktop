import React from "react";
import Input, { InputProps } from "@components/form/input/BaseInput";
import FlexBox from "@ui/components/layout/Flex";
import Text from "@ui/components/asorted/Text";
import styled from "styled-components";

const MaxButton = styled.button`
  color: ${(p) => p.theme.colors.palette.neutral.c00};
  background-color: ${(p) => p.theme.colors.palette.neutral.c100};
  border-radius: 100px;
  border-width: 0;
  padding-left: 14px;
  padding-right: 14px;
  height: 100%;
`;

export default function QuantityInput({
  onMaxClick,
  price,
  ...inputProps
}: InputProps & {
  onMaxClick?: (e: React.FormEvent<HTMLButtonElement>) => void;
  price?: string;
}): JSX.Element {
  return (
    <Input
      {...inputProps}
      type={"number"}
      renderRight={
        <FlexBox alignItems={"center"} justifyContent={"center"} pr={"3px"} py={"3px"}>
          {price && (
            <Text type={"body"} color={"palette.neutral.c70"} pr={"12px"}>
              {price}
            </Text>
          )}
          <MaxButton onClick={onMaxClick}>
            <Text type={"tiny"} color={"palette.neutral.c00"}>
              Max
            </Text>
          </MaxButton>
        </FlexBox>
      }
    />
  );
}

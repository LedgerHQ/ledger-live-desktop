import React from "react";
import Input, { InputProps } from "@components/Form/Input/BaseInput";
import FlexBox from "@ui/components/Layout/Flex";
import Text from "@ui/components/Text";
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
            <Text type={"body"} color={"palette.v2.text.secondary"} pr={"12px"}>
              {price}
            </Text>
          )}
          <MaxButton onClick={onMaxClick}>
            <Text type={"tiny"} color={"palette.v2.text.contrast"}>
              Max
            </Text>
          </MaxButton>
        </FlexBox>
      }
    />
  );
}

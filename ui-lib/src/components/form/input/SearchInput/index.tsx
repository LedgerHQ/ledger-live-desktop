import React from "react";
import Input, { InputProps, InputRenderLeftContainer } from "@components/form/input/BaseInput";
import SearchMedium from "@ui/assets/icons/SearchMedium";
import styled from "styled-components";

const Icon = styled(SearchMedium).attrs((p) => ({
  color: p.theme.colors.palette.neutral.c70,
}))``;

export default function SearchInput(props: InputProps): JSX.Element {
  return (
    <Input
      {...props}
      renderLeft={
        <InputRenderLeftContainer>
          <Icon />
        </InputRenderLeftContainer>
      }
    />
  );
}

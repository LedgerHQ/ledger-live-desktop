// @flow

import React, { useState, forwardRef } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import Box from "~/renderer/components/Box";
import SearchIcon from "~/renderer/icons/Search";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

type Props = {
  onTextChange: (evt: SyntheticInputEvent<HTMLInputElement>) => void,
  search?: string,
  placeholder?: *,
  autoFocus?: boolean,
};

const SearchInput: ThemedComponent<{}> = styled.input`
  border: none;
  background: transparent;
  outline: none;
  flex-grow: 1;
  font-family: "Inter";
  font-weight: 500;
  font-size: 13px;
  cursor: text;
  color: ${p => p.theme.colors.palette.text.shade100};
  &::placeholder {
    color: #999999;
    font-weight: 500;
  }
`;

const SearchIconContainer: ThemedComponent<{ focused?: boolean }> = styled(Box).attrs(p => ({
  style: {
    color: p.focused ? p.theme.colors.palette.text.shade100 : p.theme.colors.palette.text.shade40,
  },
}))`
  justify-content: center;
`;

const SearchBox = forwardRef(function Search(
  { onTextChange, search, placeholder, autoFocus, ...p }: Props,
  ref,
) {
  const [focused, setFocused] = useState(false);
  const { t } = useTranslation();
  return (
    <>
      <SearchIconContainer pr={3} focused={focused || !!search}>
        <SearchIcon size={16} />
      </SearchIconContainer>
      <SearchInput
        {...p}
        autoFocus={autoFocus}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder || t("common.search")}
        onChange={onTextChange}
        value={search}
        ref={ref}
      />
    </>
  );
});

export default React.memo<Props>(SearchBox);

import React, { forwardRef } from "react";
import { SearchInput } from "@ledgerhq/react-ui";
import { useTranslation } from "react-i18next";

type Props = {
  onTextChange: (value: string) => void;
  search?: string;
  placeholder?: any;
  autoFocus?: boolean;
};

const SearchBox = forwardRef(function Search(
  { onTextChange, search, placeholder, ...props }: Props,
  ref,
) {
  const { t } = useTranslation();
  return (
    <SearchInput
      {...props}
      placeholder={placeholder || t("common.search")}
      onChange={onTextChange}
      value={search}
      ref={ref}
    />
  );
});

export default React.memo<Props>(SearchBox);

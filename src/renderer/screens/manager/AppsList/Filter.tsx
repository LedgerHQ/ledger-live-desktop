import React, { useCallback, memo } from "react";
import { useTranslation } from "react-i18next";
import { Dropdown } from "@ledgerhq/react-ui";

type Props = {
  onFilterChange: Function;
  filter: any;
};

const Filter = ({ onFilterChange, filter }: Props) => {
  const onFilterChangeWrapper = useCallback(
    ({ value }) => {
      onFilterChange(value);
    },
    [onFilterChange],
  );

  const { t } = useTranslation();

  const options = [
    {
      value: "all",
      label: t("manager.applist.filter.all"),
    },
    {
      value: "not_installed",
      label: t("manager.applist.filter.not_installed"),
    },
    {
      value: "supported",
      label: t("manager.applist.filter.supported"),
    },
  ];

  const currentValue = options.find(opt => opt.value === filter);

  return (
    <Dropdown
      label={t("manager.applist.filter.title")}
      options={options}
      value={currentValue}
      onChange={onFilterChangeWrapper}
    />
  );
};

export default memo<Props>(Filter);

import React, { useCallback, memo } from "react";
import { useTranslation } from "react-i18next";
import { Dropdown } from "@ledgerhq/react-ui";

type Props = {
  onSortChange: Function;
  sort: { type: string; order: string };
};

const Sort = ({ onSortChange, sort }: Props) => {
  const onSortChangeWrapper = useCallback(
    ({ sort }) => {
      onSortChange(sort);
    },
    [onSortChange],
  );

  const { t } = useTranslation();

  const key = `${sort.type}_${sort.order}`;

  const options = [
    {
      value: "marketcap_desc",
      sort: { type: "marketcap", order: "desc" },
      label: t("manager.applist.sort.marketcap_desc"),
    },
    {
      value: "name_asc",
      sort: { type: "name", order: "asc" },
      label: t("manager.applist.sort.name_asc"),
    },
    {
      value: "name_desc",
      sort: { type: "name", order: "desc" },
      label: t("manager.applist.sort.name_desc"),
    },
  ];

  const currentValue = options.find(opt => opt.value === key);

  return (
    <Dropdown
      label={t("manager.applist.sort.title")}
      options={options}
      value={currentValue}
      onChange={onSortChangeWrapper}
    />
  );
};

export default memo<Props>(Sort);

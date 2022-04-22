import React, { useCallback } from "react";
import Dropdown from "./DropDown";

export default function SideDrawerFilter({
  refresh,
  filters,
  t,
}: {
  refresh: (params?: any) => void;
  filters: Record<
    "starred" | "liveCompatible",
    { value: boolean; toggle: () => void; disabled?: boolean }
  >;
  t: any;
}) {
  const { starred, liveCompatible } = filters;
  const resetFilters = useCallback(() => refresh({ starred: [], liveCompatible: false }), [
    refresh,
  ]);
  const onChange = useCallback(
    option => {
      if (!option) return;
      switch (option.value) {
        case "all":
          resetFilters();
          break;
        case "liveCompatible":
          liveCompatible.toggle();
          break;
        case "starred":
          starred.toggle();
          break;
      }
    },
    [liveCompatible, resetFilters, starred],
  );

  return (
    <>
      <Dropdown
        data-test-id="market-filter-drawer-button"
        label={t("market.filters.show")}
        menuPortalTarget={document.body}
        onChange={onChange}
        options={[
          {
            value: "all",
            label: t("market.filters.all"),
          },
          {
            value: "liveCompatible",
            label: t("market.filters.isLedgerCompatible"),
          },
          {
            value: "starred",
            label: t("market.filters.isFavorite"),
          },
        ]}
        value={[
          ...(!starred.value && !liveCompatible.value
            ? [
                {
                  value: "all",
                  label: t("market.filters.all"),
                },
              ]
            : []),
          ...(liveCompatible.value
            ? [
                {
                  value: "liveCompatible",
                  label: t("market.filters.isLedgerCompatible"),
                },
              ]
            : []),
          ...(starred.value
            ? [
                {
                  value: "starred",
                  label: t("market.filters.isFavorite"),
                },
              ]
            : []),
        ]}
      />
    </>
  );
}

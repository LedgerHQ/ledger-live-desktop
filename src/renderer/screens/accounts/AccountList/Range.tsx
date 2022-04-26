import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Dropdown } from "@ledgerhq/react-ui";
import { useTimeRange } from "~/renderer/actions/settings";
import Track from "~/renderer/analytics/Track";

function Range() {
  const { t } = useTranslation();
  const [range, onRangeChange, rangeItems] = useTimeRange();
  const onChange = useCallback(
    ({ value }) => {
      onRangeChange(value);
    },
    [onRangeChange],
  );

  const options = rangeItems.map(({ key }) => ({
    label: t(`accounts.range.${key || "week"}`),
    value: key,
  }));

  const value = options.find(item => item.value === range);

  return (
    <>
      <Dropdown label={t("common.range")} options={options} onChange={onChange} value={value} />
      {value ? <Track onUpdate event="ChangeRange" range={rangeItems} /> : null}
    </>
  );
}

export default React.memo<{}>(Range);

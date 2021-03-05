// @flow
import React from "react";
import { useTranslation } from "react-i18next";
import Pills from "~/renderer/components/Pills";
import { timeRangeDaysByKey } from "~/renderer/reducers/settings";
import Track from "~/renderer/analytics/Track";

type Props = {|
  selected: string,
  onChange: ({ key: string, value: *, label: string }) => void,
|};

export default function PillsDaysCount({ selected, onChange }: Props) {
  const { t } = useTranslation();
  const { day, ...target } = timeRangeDaysByKey; // FIXME LL-4442 | tmp disabled, planned for 2.22
  return (
    <>
      <Track onUpdate event="PillsDaysChange" selected={selected} />
      <Pills
        items={Object.entries(target).map(([key, value]) => ({
          key,
          value,
          label: t(`time.range.${key}`),
        }))}
        activeKey={selected}
        onChange={onChange}
        bordered
      />
    </>
  );
}

// @flow
import React from "react";
import Pills from "~/renderer/components/Pills";
import { useTimeRange } from "~/renderer/actions/settings";
import Track from "~/renderer/analytics/Track";

export default function PillsDaysCount() {
  const [selected, onChange, options] = useTimeRange();
  return (
    <>
      <Track onUpdate event="PillsDaysChange" selected={selected} />
      {/* $FlowFixMe */}
      <Pills items={options} activeKey={selected} onChange={onChange} bordered />
    </>
  );
}

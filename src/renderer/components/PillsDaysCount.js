// @flow

import React, { PureComponent } from "react";
import { withTranslation } from "react-i18next";
import type { TFunction } from "react-i18next";
import Pills from "~/renderer/components/Pills";
import { timeRangeDaysByKey } from "~/renderer/reducers/settings";
import type { TimeRange } from "~/renderer/reducers/settings";
import Track from "~/renderer/analytics/Track";

type Props = {|
  selected: string,
  onChange: ({ key: string, value: *, label: React$Node }) => *,
  t: TFunction,
|};

class PillsDaysCount extends PureComponent<Props> {
  render() {
    const { selected, onChange, t } = this.props;
    return (
      <>
        <Track onUpdate event="PillsDaysChange" selected={selected} />
        <Pills
          items={Object.keys(timeRangeDaysByKey).map((key: TimeRange) => ({
            key,
            value: timeRangeDaysByKey[key],
            label: t(`time.range.${key}`),
          }))}
          activeKey={selected}
          onChange={onChange}
          bordered
        />
      </>
    );
  }
}

export default withTranslation()(PillsDaysCount);

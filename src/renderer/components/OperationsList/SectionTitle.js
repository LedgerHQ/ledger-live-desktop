// @flow

import React from "react";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { HeaderWrapper } from "../TableContainer";
import Text from "~/renderer/components/Text";

type Props = {
  day: Date,
};

const SectionTitle = (props: Props) => {
  const { t } = useTranslation();

  const calendarOpts = {
    sameDay: `L – [${t("calendar.today")}]`,
    nextDay: `L – [${t("calendar.tomorrow")}]`,
    lastDay: `L – [${t("calendar.yesterday")}]`,
    lastWeek: "L",
    sameElse: "L",
  };
  const { day } = props;
  const d = moment(day);
  return (
    <HeaderWrapper>
      <Text ff="Inter|SemiBold" fontSize={3} color="palette.text.shade50">
        {d.calendar(null, calendarOpts)}
      </Text>
    </HeaderWrapper>
  );
};

export default SectionTitle;

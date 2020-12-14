// @flow

import React from "react";
import { useTranslation } from "react-i18next";
import moment from "moment";
import Box from "~/renderer/components/Box";

type Props = {
  day: Date,
};

const SectionTitle = (props: Props) => {
  const { t } = useTranslation();

  const calendarOpts = {
    sameDay: `LL – [${t("calendar.today")}]`,
    nextDay: `LL – [${t("calendar.tomorrow")}]`,
    lastDay: `LL – [${t("calendar.yesterday")}]`,
    lastWeek: "LL",
    sameElse: "LL",
  };
  const { day } = props;
  const d = moment(day);
  return (
    <Box ff="Inter|SemiBold" fontSize={4} color="palette.text.shade60">
      {d.calendar(null, calendarOpts)}
    </Box>
  );
};

export default SectionTitle;

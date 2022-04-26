import React from "react";
import { useTranslation } from "react-i18next";
import moment from "moment";
import { HeaderWrapper } from "../TableContainer";
import { Text } from "@ledgerhq/react-ui";

type Props = {
  day: Date;
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
    <HeaderWrapper>
      <Text uppercase variant="small" fontWeight="semiBold" color="palette.neutral.c80">
        {d.calendar(null, calendarOpts)}
      </Text>
    </HeaderWrapper>
  );
};

export default SectionTitle;

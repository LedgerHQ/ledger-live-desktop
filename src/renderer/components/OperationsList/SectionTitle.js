// @flow

import React from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import moment from "moment";
import Box from "~/renderer/components/Box";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import { rgba } from "~/renderer/styles/helpers";

type Props = {
  day: Date,
};

const Wrapper: ThemedComponent<{}> = styled(Box)`
  padding: 10px 20px;
  border-bottom: 1px solid ${p => p.theme.colors.palette.divider};
  border-top: 1px solid ${p => p.theme.colors.palette.divider};
  background-color: ${p => rgba(p.theme.colors.palette.secondary.main, 0.02)};
`;

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
    <Wrapper ff="Inter|SemiBold" fontSize={3} color="palette.text.shade50">
      {d.calendar(null, calendarOpts)}
    </Wrapper>
  );
};

export default SectionTitle;

// @flow
import React from "react";
import { useTranslation } from "react-i18next";
import type { RouterHistory, Match, Location } from "react-router-dom";
import Box from "~/renderer/components/Box";
import TrackPage from "~/renderer/analytics/TrackPage";
import IconLock from "~/renderer/icons/Lock";
import {
  SettingsSection as Section,
  SettingsSectionHeader as Header,
  SettingsSectionBody as Body,
} from "../settings/SettingsSection";

type Props = {
  history: RouterHistory,
  location: Location,
  match: Match,
};

// Props are passed from the <Route /> component in <Default />
const Password = ({ history, location, match }: Props) => {
  const { t } = useTranslation();

  return (
    <Box pb={4} selectable>
      <Box
        ff="Inter|SemiBold"
        color="palette.text.shade100"
        fontSize={7}
        mb={5}
        data-e2e="password_title"
      >
        {t("llpassword.title")}
      </Box>
      <Section>
        <TrackPage category="Password" name="Index" />

        <Header
          icon={<IconLock size={16} />}
          title={t("llpassword.title")}
          desc={t("llpassword.desc")}
        />

        <Body>Coucou</Body>
      </Section>
    </Box>
  );
};
export default Password;

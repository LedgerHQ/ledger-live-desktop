// @flow
import React from "react";
import { Trans } from "react-i18next";
import getPartners from "@ledgerhq/live-common/lib/partners/react";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import useTheme from "~/renderer/hooks/useTheme";
import { PartnerCard } from "./PartnerCard";

const Partners = () => {
  const isDark = useTheme("colors.palette.type") === "dark";
  const partners = getPartners(isDark);

  return (
    <Box pb={6} selectable>
      <TrackPage category="Exchange" />
      <Box ff="Inter|SemiBold" fontSize={7} color="palette.text.shade100">
        <Trans i18nKey="partners.title" />
      </Box>
      <Box ff="Inter|Light" fontSize={5} mb={5} color="palette.text.shade80">
        <Trans i18nKey="partners.desc" />
      </Box>
      <Box flow={3}>
        {partners.map(card => (
          <PartnerCard key={card.id} card={card} />
        ))}
      </Box>
    </Box>
  );
};

export default Partners;

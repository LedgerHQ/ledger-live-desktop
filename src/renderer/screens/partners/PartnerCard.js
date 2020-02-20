// @flow

import React, { useCallback } from "react";
import { Trans } from "react-i18next";
import { openURL } from "~/renderer/linking";
import ExternalLinkIcon from "~/renderer/icons/ExternalLink";
import Box, { Card } from "~/renderer/components/Box";
import { FakeLink } from "~/renderer/components/Link";

type CardType = {
  id: string,
  Logo: any,
  url: string,
};

export const PartnerCard = ({ card }: { card: CardType }) => {
  const onClick = useCallback(() => {
    openURL(card.url, "VisitPartner", { id: card.id });
  }, [card]);

  return (
    <Card horizontal py={5} px={6}>
      <Box justifyContent="center" style={{ width: 180, marginRight: 32 }}>
        <card.Logo width={180} />
      </Box>
      <Box shrink ff="Inter|Regular" fontSize={4} flow={3}>
        <Box>
          <Trans i18nKey={`partners.${card.id}`} />
        </Box>
        <Box horizontal alignItems="center" color="wallet" flow={1}>
          <FakeLink onClick={onClick}>
            <Trans i18nKey="partners.visitWebsite" />
          </FakeLink>
          <ExternalLinkIcon size={14} />
        </Box>
      </Box>
    </Card>
  );
};

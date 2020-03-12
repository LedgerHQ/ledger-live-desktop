// @flow

import React from "react";
import TrackPage from "~/renderer/analytics/TrackPage";
import Box from "~/renderer/components/Box";
import { Trans, withTranslation } from "react-i18next";
import IconDonjon from "~/renderer/icons/Donjon";
import Text from "~/renderer/components/Text";
import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";
import { openURL } from "~/renderer/linking";
import { urls } from "~/config/urls";
import Button from "~/renderer/components/Button";
import styled from "styled-components";

const Body = styled(Box)`
  max-width: 480px;
  align-items: center;
  align-self: center;
  text-align: center;
`;

const Illustration = styled.div`
  margin-bottom: 24px;
`;

const Landing = ({ providers, onContinue }: { providers: string[], onContinue: any }) => {
  return (
    <Box>
      <TrackPage category="Swap" />
      <Box horizontal style={{ paddingBottom: 32 }}>
        <Box
          grow
          ff="Inter|SemiBold"
          fontSize={7}
          color="palette.text.shade100"
          data-e2e="swapPage_title"
        >
          <Trans i18nKey="swap.title" />
        </Box>
      </Box>
      <Body>
        <Illustration>
          <IconDonjon size={240} />
        </Illustration>
        <Text ff="Inter|SemiBold" fontSize={6} color="palette.text.shade80">
          <Trans i18nKey="swap.landing.title" />
        </Text>
        <Text ff="Inter|Medium" fontSize={4} mt={2} mb={4} color="palette.text.shade60">
          <Trans i18nKey="swap.landing.description" />
        </Text>
        <LinkWithExternalIcon
          label={<Trans i18nKey="swap.landing.link" />}
          onClick={() => openURL(urls.faq)}
        />
        {!providers || providers.length ? (
          <Button mt={32} disabled={!providers} isLoading={!providers} primary onClick={onContinue}>
            <Trans i18nKey="swap.landing.continue" />
          </Button>
        ) : (
          <Box mt={32}>
            <Text ff="Inter|SemiBold" fontSize={4} color="palette.text.shade80">
              <Trans i18nKey="swap.landing.sorry" />
            </Text>
          </Box>
        )}
      </Body>
    </Box>
  );
};

export default withTranslation()(Landing);

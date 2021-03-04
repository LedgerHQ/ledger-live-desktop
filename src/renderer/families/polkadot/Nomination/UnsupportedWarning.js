// @flow
import React from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";

import { darken, lighten } from "~/renderer/styles/helpers";

import WarnBox from "~/renderer/components/WarnBox";
import Box from "~/renderer/components/Box";
import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";

const Address = styled.span.attrs(() => ({
  color: "wallet",
  ff: "Inter|SemiBold",
}))`
  color: ${p => p.theme.colors.wallet};
  &:hover {
    cursor: pointer;
    color: ${p => lighten(p.theme.colors.wallet, 0.1)};
  }
  &:active {
    color: ${p => darken(p.theme.colors.wallet, 0.1)};
  }
`;

export const ExternalControllerUnsupportedWarning = ({
  address,
  onExternalLink,
  onLearnMore,
}: {
  address: ?string,
  onExternalLink: Function,
  onLearnMore: Function,
}) => (
  <WarnBox>
    <Trans i18nKey="polkadot.nomination.externalControllerUnsupported" values={{ address }}>
      <p>
        <Address onClick={() => onExternalLink(address)} />
      </p>
      <p />
    </Trans>
    <Box mt={2}>
      <LinkWithExternalIcon
        label={<Trans i18nKey="polkadot.nomination.emptyState.info" />}
        onClick={onLearnMore}
      />
    </Box>
  </WarnBox>
);

export const ExternalStashUnsupportedWarning = ({
  address,
  onExternalLink,
  onLearnMore,
}: {
  address: ?string,
  onExternalLink: Function,
  onLearnMore: Function,
}) => (
  <WarnBox>
    <Trans i18nKey="polkadot.nomination.externalStashUnsupported" values={{ address }}>
      <p>
        <Address onClick={() => onExternalLink(address)} />
      </p>
      <p />
    </Trans>
    <Box mt={2}>
      <LinkWithExternalIcon
        label={<Trans i18nKey="polkadot.nomination.emptyState.info" />}
        onClick={onLearnMore}
      />
    </Box>
  </WarnBox>
);

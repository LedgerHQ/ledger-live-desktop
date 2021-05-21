// @flow
import React from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";

import { urls } from "~/config/urls";
import { darken, lighten } from "~/renderer/styles/helpers";

import Alert from "~/renderer/components/Alert";

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
}: {
  address: ?string,
  onExternalLink: Function,
}) => (
  <Alert
    type="help"
    learnMoreUrl={urls.stakingPolkadot}
    learnMoreLabel={<Trans i18nKey="polkadot.nomination.emptyState.info" />}
    style={{ border: "none", margin: 0 }}
  >
    <Trans i18nKey="polkadot.nomination.externalControllerUnsupported" values={{ address }}>
      <p>
        <Address onClick={() => onExternalLink(address)} />
      </p>
      <p />
    </Trans>
  </Alert>
);

export const ExternalStashUnsupportedWarning = ({
  address,
  onExternalLink,
}: {
  address: ?string,
  onExternalLink: Function,
}) => (
  <Alert
    type="help"
    learnMoreUrl={urls.stakingPolkadot}
    learnMoreLabel={<Trans i18nKey="polkadot.nomination.emptyState.info" />}
    style={{ border: "none", margin: 0 }}
  >
    <Trans i18nKey="polkadot.nomination.externalStashUnsupported" values={{ address }}>
      <p>
        <Address onClick={() => onExternalLink(address)} />
      </p>
      <p />
    </Trans>
  </Alert>
);

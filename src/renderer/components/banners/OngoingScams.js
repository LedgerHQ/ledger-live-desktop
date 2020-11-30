// @flow

import React from "react";
import TopBanner from "~/renderer/components/TopBanner";
import TriangleWarning from "~/renderer/icons/TriangleWarning";
import { Trans } from "react-i18next";
import styled from "styled-components";
import { openURL } from "~/renderer/linking";
import { urls } from "~/config/urls";

const Link = styled.span`
  color: ${p => p.theme.colors.palette.primary.contrastText};
  text-decoration: underline;
  cursor: pointer;
`;

const OngoingScams = () => (
  <TopBanner
    status="orange"
    dismissable
    content={{
      message: <Trans i18nKey="banners.ongoingScams" />,
      Icon: TriangleWarning,
      right: (
        <Link id="modal-ongoing-scams-button" onClick={() => openURL(urls.banners.ongoingScams)}>
          <Trans i18nKey="common.learnMore" />
        </Link>
      ),
    }}
    bannerId={"ongoing-scams"}
  />
);
export default OngoingScams;

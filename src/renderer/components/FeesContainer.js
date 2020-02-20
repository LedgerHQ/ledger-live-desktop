// @flow

import React from "react";
import { withTranslation } from "react-i18next";
import type { TFunction } from "react-i18next";
import { openURL } from "~/renderer/linking";
import Box from "~/renderer/components/Box";
import LabelWithExternalIcon from "~/renderer/components/LabelWithExternalIcon";
import { urls } from "~/config/urls";
import { track } from "~/renderer/analytics/segment";

export default withTranslation()(
  ({
    children,
    header,
    t,
    i18nKeyOverride,
  }: {
    children: React$Node,
    header?: React$Node,
    i18nKeyOverride?: string,
    t: TFunction,
  }) => (
    <Box flow={1}>
      <Box horizontal alignItems="center" justifyContent="space-between">
        <LabelWithExternalIcon
          onClick={() => {
            openURL(urls.feesMoreInfo);
            track("Send Flow Fees Help Requested");
          }}
          label={t(i18nKeyOverride || "send.steps.details.fees")}
        />
        {header}
      </Box>
      {children}
    </Box>
  ),
);

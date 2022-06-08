// @flow
import React from "react";
import { Trans } from "react-i18next";

import { openURL } from "~/renderer/linking";
import { urls } from "~/config/urls";
import LinkWithExternalIcon from "~/renderer/components/LinkWithExternalIcon";

import type { StepProps } from "~/renderer/modals/AddAccounts/index";

// "no associated accounts" text when adding/importing accounts
const NoAssociatedAccounts = ({ t }: StepProps) => {
  return (
    <div>
      <Trans i18nKey="hedera.createHederaAccountHelp.text"></Trans>{" "}
      <LinkWithExternalIcon
        fontSize={3}
        onClick={() => openURL(urls.hedera.supportArticleLink)}
        label={t("hedera.createHederaAccountHelp.link")}
      />
    </div>
  );
};

export default NoAssociatedAccounts;

import React from "react";
import { useTranslation } from "react-i18next";
import TrackPage from "~/renderer/analytics/TrackPage";
import { SectionRow as Row } from "../../Rows";
import HideEmptyTokenAccountsToggle from "./HideEmptyTokenAccountsToggle";
import SectionExport from "./Export";
import Currencies from "./Currencies";
import BlacklistedTokens from "./BlacklistedTokens";
import { Flex } from "@ledgerhq/react-ui";

export default function SectionAccounts() {
  const { t } = useTranslation();

  return (
    <Flex flexDirection="column" rowGap={12}>
      <TrackPage category="Settings" name="Accounts" />
      <SectionExport />
      <Row
        title={t("settings.accounts.hideEmptyTokens.title")}
        desc={t("settings.accounts.hideEmptyTokens.desc")}
      >
        <HideEmptyTokenAccountsToggle />
      </Row>
      <BlacklistedTokens />
      <Currencies />
    </Flex>
  );
}

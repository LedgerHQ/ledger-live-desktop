// @flow

import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

import { openModal } from "~/renderer/actions/modals";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import Image from "~/renderer/components/Image";
import lightEmptyStateAccounts from "~/renderer/images/light-empty-state-accounts.svg";
import darkEmptyStateAccounts from "~/renderer/images/dark-empty-state-accounts.svg";

import type { ThemedComponent } from "~/renderer/styles/StyleProvider";

const EmptyState = () => {
  const dispatch = useDispatch();
  const { push } = useHistory();
  const { t } = useTranslation();

  const handleInstallApp = useCallback(() => {
    push("/manager");
  }, [push]);

  const openAddAccounts = useCallback(() => {
    dispatch(openModal("MODAL_ADD_ACCOUNTS"));
  }, [dispatch]);

  return (
    <Box alignItems="center" pb={8} style={{ margin: "auto" }}>
      <Image
        alt="emptyState Dashboard logo"
        resource={{
          light: lightEmptyStateAccounts,
          dark: darkEmptyStateAccounts,
        }}
        width="500"
        themeTyped
      />
      <Box mt={5} alignItems="center">
        <Title data-automation-id="empty-state-title">{t("emptyState.dashboard.title")}</Title>
        <Description mt={3} style={{ maxWidth: 600 }} data-automation-id="empty-state-description">
          {t("emptyState.dashboard.desc")}
        </Description>
        <Box mt={5} horizontal style={{ width: 300 }} flow={3} justifyContent="center">
          <Button
            primary
            style={{ minWidth: 120 }}
            onClick={handleInstallApp}
            data-automation-id="accounts-empty-state-openmanager-button"
          >
            {t("emptyState.dashboard.buttons.installApp")}
          </Button>
          <Button
            outline
            style={{ minWidth: 120 }}
            onClick={openAddAccounts}
            data-automation-id="accounts-empty-state-addaccounts-button"
          >
            {t("emptyState.dashboard.buttons.addAccount")}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export const Title: ThemedComponent<{}> = styled(Box).attrs(() => ({
  ff: "Inter|Regular",
  fontSize: 6,
  color: p => p.theme.colors.palette.text.shade100,
}))``;

export const Description: ThemedComponent<{}> = styled(Box).attrs(() => ({
  ff: "Inter|Regular",
  fontSize: 4,
  color: p => p.theme.colors.palette.text.shade80,
  textAlign: "center",
}))``;

export default React.memo<{}>(EmptyState);

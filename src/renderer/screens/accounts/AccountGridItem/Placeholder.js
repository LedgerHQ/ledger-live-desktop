// @flow

import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import styled from "styled-components";

import { openModal } from "~/renderer/actions/modals";
import Box from "~/renderer/components/Box";
import Button from "~/renderer/components/Button";
import Image from "~/renderer/components/Image";
import type { ThemedComponent } from "~/renderer/styles/StyleProvider";
import lightEmptyAccountTile from "~/renderer/images/light-empty-account-tile.svg";
import darkEmptyAccountTile from "~/renderer/images/dark-empty-account-tile.svg";

const Wrapper: ThemedComponent<{}> = styled(Box).attrs(() => ({
  p: 4,
  flex: 1,
  alignItems: "center",
}))`
  border: 1px dashed ${p => p.theme.colors.palette.divider};
  border-radius: 4px;
  height: 215px;
`;

const Placeholder = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const openAddAccounts = useCallback(() => {
    dispatch(openModal("MODAL_ADD_ACCOUNTS"));
  }, [dispatch]);

  return (
    <Box mb={5}>
      <Wrapper data-e2e="dashboard_AccountPlaceOrder">
        <Box mt={2}>
          <Image
            alt="empty account placeholder"
            resource={{
              light: lightEmptyAccountTile,
              dark: darkEmptyAccountTile,
            }}
            themeTyped
          />
        </Box>
        <Box
          ff="Inter"
          fontSize={3}
          color="palette.text.shade60"
          pb={2}
          mt={3}
          textAlign="center"
          style={{ maxWidth: 150 }}
        >
          {t("dashboard.emptyAccountTile.desc")}
        </Box>
        <Button primary onClick={openAddAccounts}>
          {t("dashboard.emptyAccountTile.createAccount")}
        </Button>
      </Wrapper>
    </Box>
  );
};

export default Placeholder;

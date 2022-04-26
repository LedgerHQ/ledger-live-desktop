import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Flex, Icons, Text } from "@ledgerhq/react-ui";
import { openModal } from "~/renderer/actions/modals";
import Button from "~/renderer/components/Button";
import Image from "~/renderer/components/Image";
import Cell from "./Cell";
import lightEmptyAccountTile from "~/renderer/images/light-empty-account-tile.svg";
import darkEmptyAccountTile from "~/renderer/images/dark-empty-account-tile.svg";

const Placeholder = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const openAddAccounts = useCallback(() => {
    dispatch(openModal("MODAL_ADD_ACCOUNTS"));
  }, [dispatch]);

  return (
    <Cell
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      rowGap={6}
      padding={9}
      data-e2e="dashboard_AccountPlaceOrder"
    >
      <Flex>
        <Image
          alt="empty account placeholder"
          resource={{
            light: lightEmptyAccountTile,
            dark: darkEmptyAccountTile,
          }}
          themeTyped
        />
      </Flex>
      <Text variant="paragraph" fontWeight="medium">
        {t("dashboard.emptyAccountTile.desc")}
      </Text>
      <Button variant="shade" Icon={Icons.PlusMedium} iconPosition="left" onClick={openAddAccounts}>
        {t("dashboard.emptyAccountTile.createAccount")}
      </Button>
    </Cell>
  );
};

export default Placeholder;

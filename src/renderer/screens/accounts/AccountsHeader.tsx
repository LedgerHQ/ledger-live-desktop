import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Flex, Text, Icons } from "@ledgerhq/react-ui";

import { openModal } from "~/renderer/actions/modals";
import Button from "~/renderer/components/Button";

import OptionsButton from "./OptionsButton";

const AccountsHeader = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const openAddAccounts = useCallback(() => {
    dispatch(openModal("MODAL_ADD_ACCOUNTS"));
  }, [dispatch]);

  return (
    <Flex
      flexDirection="row"
      paddingX={12}
      paddingY={7}
      alignItems="center"
      justifyContent="space-between"
    >
      <Flex id="accounts-title">
        <Text variant="h3" color="palette.neutral.c100">
          {t("accounts.title")}
        </Text>
      </Flex>
      <Flex flexDirection="row" columnGap={5} alignItems="center" justifyContent="flex-end">
        <Button
          variant="main"
          Icon={Icons.PlusMedium}
          iconPosition="left"
          onClick={openAddAccounts}
          id="accounts-add-account-button"
        >
          {t("addAccounts.cta.add")}
        </Button>
        <OptionsButton />
      </Flex>
    </Flex>
  );
};

export default React.memo<{}>(AccountsHeader);

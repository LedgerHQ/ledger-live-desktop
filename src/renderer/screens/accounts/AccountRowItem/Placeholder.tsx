import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { Icons } from "@ledgerhq/react-ui";
import { openModal } from "~/renderer/actions/modals";
import Button from "~/renderer/components/Button";

const Placeholder = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const openAddAccounts = useCallback(() => {
    dispatch(openModal("MODAL_ADD_ACCOUNTS"));
  }, [dispatch]);

  return (
    <Button
      outline
      variant="shade"
      Icon={Icons.PlusMedium}
      onClick={openAddAccounts}
      iconPosition="left"
      mt={8}
      ml={12}
      mr={12}
    >
      {t("addAccounts.cta.add")}
    </Button>
  );
};

export default React.memo<{}>(Placeholder);
